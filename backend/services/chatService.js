import Chat from '../models/chats.js';
import Message from '../models/messages.js';
import ChatVariable from '../models/chatVariables.js';
import Workflow from '../models/workflow.js';
import WorkflowNode from '../models/workflowNodes.js';
import NodeTransition from '../models/nodeTransitions.js';
import Bot from '../models/bot.js';
import WorkflowAnalytics from '../models/workflowAnalytics.js';
import nlpService from './nlpService.js';

class ChatService {
  /**
   * START CHAT
   * Creates a new chat session and finds the right workflow to start
   */
  async startChat({ bot_id, external_user_id, metadata = {} }) {
    // 1. Verify bot exists and is active
    const bot = await Bot.findOne({
      where: { id: bot_id, is_active: true },
    });

    if (!bot) {
      throw new Error('Bot not found or inactive');
    }

    // 2. Find an active workflow for this bot (you can add trigger logic here)
    const workflow = await Workflow.findOne({
      where: { bot_id, is_active: true },
      include: [{ model: WorkflowNode }],
    });

    if (!workflow) {
      throw new Error('No active workflow found for this bot');
    }

    // 3. Find the start node
    const startNode = await WorkflowNode.findByPk(workflow.start_node_id);

    if (!startNode) {
      throw new Error('Workflow has no start node');
    }

    // 4. Create chat session
    const chat = await Chat.create({
      bot_id,
      workflow_id: workflow.id,
      external_user_id,
      current_node_id: startNode.id,
      context: metadata,
      status: 'active',
    });

    // 5. Log analytics - workflow started
    await WorkflowAnalytics.create({
      workflow_id: workflow.id,
      chat_id: chat.id,
      event_type: 'workflow_started',
      metadata: { bot_id, external_user_id },
    });

    // 6. Execute the start node (welcome message)
    const initialResponse = await this.executeNode(chat.id, startNode);

    return {
      chat_id: chat.id,
      workflow_name: workflow.name,
      message: initialResponse,
    };
  }

  /**
   * PROCESS MESSAGE
   * Main function - handles incoming user messages
   */
  async processMessage(chatId, { message, message_type = 'text' }) {
    // 1. Load chat with current node
    const chat = await Chat.findByPk(chatId, {
      include: [
        {
          model: WorkflowNode,
          as: 'currentNode',
          include: [
            {
              model: NodeTransition,
              as: 'transitionsFrom',
            },
          ],
        },
        { model: Workflow },
      ],
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.status === 'completed') {
      throw new Error('Chat has already ended');
    }

    // 2. Save user message
    await Message.create({
      chat_id: chatId,
      sender: 'user',
      message_type,
      content: message,
    });

    // 3. Get current node
    const currentNode = chat.currentNode;

    if (!currentNode) {
      throw new Error('Invalid chat state - no current node');
    }

    // 4. **NLP MAGIC HAPPENS HERE** - Analyze user intent
    let intent = null;
    let entities = {};

    if (currentNode.node_type === 'question' || currentNode.config?.use_nlp) {
      const nlpResult = await nlpService.analyzeMessage(
        message,
        chat.Workflow.id
      );
      intent = nlpResult.intent;
      entities = nlpResult.entities;
    }

    // 5. Find matching transition
    const nextNode = await this.findNextNode(
      currentNode,
      message,
      intent,
      entities,
      chat
    );

    if (!nextNode) {
      // Fallback response
      return await this.handleFallback(chatId, currentNode);
    }

    // 6. Update chat variables if entities found
    if (Object.keys(entities).length > 0) {
      await this.updateChatVariables(chatId, entities);
    }

    // 7. Update current node
    await chat.update({ current_node_id: nextNode.id });

    // 8. Log analytics
    await WorkflowAnalytics.create({
      workflow_id: chat.workflow_id,
      chat_id: chatId,
      node_id: nextNode.id,
      event_type: 'node_entered',
      metadata: { intent, entities },
    });

    // 9. Execute the next node
    const response = await this.executeNode(chatId, nextNode);

    return response;
  }

  /**
   * FIND NEXT NODE
   * Evaluates transitions to find which node to go to next
   */
  async findNextNode(currentNode, userMessage, intent, entities, chat) {
    const transitions = currentNode.transitionsFrom || [];

    // Sort by priority (higher priority first)
    const sortedTransitions = transitions.sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    );

    for (const transition of sortedTransitions) {
      let matches = false;

      switch (transition.trigger_type) {
        case 'intent':
          // Match by NLP intent
          matches = intent === transition.trigger_value;
          break;

        case 'button_click':
          // Match exact button value
          matches = userMessage.toLowerCase() === transition.trigger_value.toLowerCase();
          break;

        case 'keyword':
          // Match keyword in message
          matches = userMessage.toLowerCase().includes(transition.trigger_value.toLowerCase());
          break;

        case 'condition':
          // Evaluate condition against chat variables
          matches = await this.evaluateCondition(
            transition.condition,
            chat.id
          );
          break;

        case 'auto':
          // Always matches (auto-transition)
          matches = true;
          break;

        default:
          matches = false;
      }

      if (matches) {
        return await WorkflowNode.findByPk(transition.to_node_id);
      }
    }

    return null; // No matching transition
  }

  /**
   * EXECUTE NODE
   * Performs the action of a node (send message, ask question, call API, etc.)
   */
  async executeNode(chatId, node) {
    const chat = await Chat.findByPk(chatId, {
      include: [{ model: ChatVariable }],
    });

    let response = {};

    switch (node.node_type) {
      case 'message':
        // Send a text message
        response = await this.sendMessage(chatId, node.config);
        break;

      case 'question':
        // Ask a question (maybe with buttons)
        response = await this.sendQuestion(chatId, node.config);
        break;

      case 'action':
        // Execute an action (API call, save data, etc.)
        response = await this.executeAction(chatId, node.config);
        
        // Auto-transition to next node after action
        const autoTransition = await NodeTransition.findOne({
          where: {
            from_node_id: node.id,
            trigger_type: 'auto',
          },
        });

        if (autoTransition) {
          const nextNode = await WorkflowNode.findByPk(autoTransition.to_node_id);
          return await this.executeNode(chatId, nextNode);
        }
        break;

      case 'condition':
        // Branch based on condition
        const conditionMet = await this.evaluateCondition(
          node.config.condition,
          chatId
        );

        const conditionTransition = await NodeTransition.findOne({
          where: {
            from_node_id: node.id,
            trigger_value: conditionMet ? 'true' : 'false',
          },
        });

        if (conditionTransition) {
          const nextNode = await WorkflowNode.findByPk(conditionTransition.to_node_id);
          return await this.executeNode(chatId, nextNode);
        }
        break;

      case 'end':
        // End the conversation
        await chat.update({ status: 'completed' });
        response = {
          message: node.config.message || 'Thank you! Conversation ended.',
          ended: true,
        };
        break;

      default:
        response = { message: 'Node type not supported' };
    }

    return response;
  }

  /**
   * SEND MESSAGE
   * Renders and sends a message to the user
   */
  async sendMessage(chatId, config) {
    const message = await this.renderTemplate(config.text || config.message, chatId);

    await Message.create({
      chat_id: chatId,
      sender: 'bot',
      message_type: 'text',
      content: message,
    });

    return { message };
  }

  /**
   * SEND QUESTION
   * Sends a question with optional buttons
   */
  async sendQuestion(chatId, config) {
    const message = await this.renderTemplate(config.text || config.question, chatId);

    await Message.create({
      chat_id: chatId,
      sender: 'bot',
      message_type: 'question',
      content: message,
      metadata: { buttons: config.buttons || [] },
    });

    return {
      message,
      buttons: config.buttons || [],
    };
  }

  /**
   * EXECUTE ACTION
   * Performs custom actions like API calls
   */
  async executeAction(chatId, config) {
    // Example: Save variables, call external API, etc.
    if (config.action === 'save_variable') {
      await ChatVariable.create({
        chat_id: chatId,
        key: config.variable_name,
        value: config.variable_value,
      });
    }

    // You can add more action types here
    return { success: true, action: config.action };
  }

  /**
   * RENDER TEMPLATE
   * Replaces variables in messages like "Hello {{name}}"
   */
  async renderTemplate(template, chatId) {
    const variables = await ChatVariable.findAll({
      where: { chat_id: chatId },
    });

    let rendered = template;

    variables.forEach((variable) => {
      const placeholder = `{{${variable.key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), variable.value);
    });

    return rendered;
  }

  /**
   * EVALUATE CONDITION
   * Evaluates expressions like "plan == premium"
   */
  async evaluateCondition(condition, chatId) {
    // Simple condition evaluator
    // You can use a library like 'expr-eval' for complex expressions
    const variables = await ChatVariable.findAll({
      where: { chat_id: chatId },
    });

    const context = {};
    variables.forEach((v) => {
      context[v.key] = v.value;
    });

    // Very basic evaluation (you should use a proper expression parser)
    try {
      const fn = new Function(...Object.keys(context), `return ${condition}`);
      return fn(...Object.values(context));
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  /**
   * UPDATE CHAT VARIABLES
   */
  async updateChatVariables(chatId, variables) {
    for (const [key, value] of Object.entries(variables)) {
      await ChatVariable.upsert({
        chat_id: chatId,
        key,
        value,
      });
    }
  }

  /**
   * FALLBACK HANDLER
   */
  async handleFallback(chatId, currentNode) {
    const fallbackMessage = currentNode.config?.fallback_message || 
      "I didn't understand that. Can you try again?";

    await Message.create({
      chat_id: chatId,
      sender: 'bot',
      message_type: 'text',
      content: fallbackMessage,
    });

    return { message: fallbackMessage };
  }

  /**
   * GET CHAT HISTORY
   */
  async getChatHistory(chatId, { limit, offset }) {
    return await Message.findAll({
      where: { chat_id: chatId },
      order: [['created_at', 'ASC']],
      limit,
      offset,
    });
  }

  /**
   * GET CHAT DETAILS
   */
  async getChatDetails(chatId) {
    return await Chat.findByPk(chatId, {
      include: [
        { model: Bot },
        { model: Workflow },
        { model: WorkflowNode, as: 'currentNode' },
        { model: ChatVariable },
      ],
    });
  }

  /**
   * UPDATE CHAT CONTEXT
   */
  async updateChatContext(chatId, context) {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    await chat.update({ context: { ...chat.context, ...context } });
    return chat;
  }

  /**
   * END CHAT
   */
  async endChat(chatId) {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    await chat.update({ status: 'completed' });

    await WorkflowAnalytics.create({
      workflow_id: chat.workflow_id,
      chat_id: chatId,
      event_type: 'workflow_completed',
    });

    return { message: 'Chat ended successfully' };
  }
}

export default new ChatService();