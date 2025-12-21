import Workflow from '../models/Workflow.js';
import WorkflowNode from '../models/workflowNodes.js';
import NodeTransition from '../models/nodeTransitions.js';
import WorkflowTrigger from '../models/workflowTrigger.js';
import Bot from '../models/Bot.js';

class WorkflowService {
    /**
     * create a new workflow
     */
    async createWorkflow(name, description, botId, ownerId) {
        const bot  = await Bot.findOne({ where: { id: botId, user_id: userId}});

        if(!bot) {
            throw new Error('Bot not found or unauthorized');
        }

        const workflow = await Workflow.create({
            bot_id: botId,
            name,
            description,
            is_active: false
        });

        return workflow;
    }

    /**
     * Get all workflows for a bot
     */
    async getWorkflowsByBot(botId, userId) {
        const bot = await Bot.findOne({ where: { id: botId, user_id: userId }});

        if(!bot) {
            throw new Error('Bot not found or unauthorized');
        }
        const workflows = await Workflow.findAll({
            where: { bot_id: botId},
            include: [
                {
                    model: WorkflowNode,
                    attributes: ['id','node_type','position']
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return workflows;
    }

    /**
     * Get workflow by id with full details
     */
    async getWorkflowsByBotId(workflowId, userId) {
        const workflow = await Workflow.findOne({
            where: { id: workflowId },
            include: [
                {
                    model: Bot,
                    where: { user_id: userId },
                    attributes: ['id', 'name'],
                },
                {
                    model: WorkflowNode,
                    include: [
                        {
                            model: NodeTransition,
                            as: 'transitionsFrom',
                        },
                    ],
                },
                {
                    model: WorkflowTrigger,
                }
            ]
        });

        if(!workflow) {
            throw new Error('Workflow not found or unauthorized');
        }
        return workflow;
    }

    /**
     * update workflow
     */
    async updateWorkflow(workflowId, userId, updates) {
        const workflow = await Workflow.findOne({
            where: { id: workflowId },
            include: [
                {
                    model: Bot,
                    where: { user_id: userId },

                },
            ],
        });

        if(!workflow) {
            throw new Error('Workflow not found or unauthorized');
        }

        await Workflow.update(updates);
        return workflow;
    }

    /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId, userId) {
    const workflow = await Workflow.findOne({
      where: { id: workflowId },
      include: [
        {
          model: Bot,
          where: { user_id: userId },
        },
      ],
    });

    if (!workflow) {
      throw new Error('Workflow not found or unauthorized');
    }

    await workflow.destroy();
    return { message: 'Workflow deleted successfully' };
  }


    /**
   * Add node to workflow
   */
  async addNode(workflowId, userId, nodeData) {
    const workflow = await Workflow.findOne({
      where: { id: workflowId },
      include: [
        {
          model: Bot,
          where: { user_id: userId },
        },
      ],
    });

    if (!workflow) {
      throw new Error('Workflow not found or unauthorized');
    }

    const node = await WorkflowNode.create({
      workflow_id: workflowId,
      ...nodeData,
    });

    return node;
  }


  /**
   * Add transition between nodes
   */
  async addTransition(workflowId, userId, transitionData) {
    const workflow = await Workflow.findOne({
      where: { id: workflowId },
      include: [
        {
          model: Bot,
          where: { user_id: userId },
        },
      ],
    });

    if (!workflow) {
      throw new Error('Workflow not found or unauthorized');
    }

    const transition = await NodeTransition.create(transitionData);
    return transition;
  }
}

export default new WorkflowService();