import Workflow from '../models/workflow.js';
import WorkflowNode from '../models/workflowNodes.js';
import NodeTransition from '../models/nodeTransitions.js';
import WorkflowTrigger from '../models/workflowTrigger.js';
import Bot from '../models/bot.js';

class WorkflowService {
    /**
     * create a new workflow
     */
    async createWorkflow(userId, {name, description, botId}) {
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
            order: [['created_at', 'DESC']],
        });

        return workflows;
    }

    /**
     * Get workflow by id with full details
     */
    async getWorkflowsById(workflowId, userId) {
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

        await workflow.update(updates);
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
   * Update node
   */
  async updateNode(workflowId, nodeId, userId, updates) {
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

    const node = await WorkflowNode.findOne({
      where: { id: nodeId, workflow_id: workflowId },
    });

    if (!node) {
      throw new Error('Node not found');
    }

    await node.update(updates);
    return node;
  }

  /**
   * Delete node
   */
  async deleteNode(workflowId, nodeId, userId) {
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

    const node = await WorkflowNode.findOne({
      where: { id: nodeId, workflow_id: workflowId },
    });

    if (!node) {
      throw new Error('Node not found');
    }

    // Delete associated transitions first
    await NodeTransition.destroy({
      where: {
        [Op.or]: [{ from_node_id: nodeId }, { to_node_id: nodeId }],
      },
    });

    await node.destroy();
    return { message: 'Node deleted successfully' };
  }

  /**
   * Delete transition
   */
  async deleteTransition(workflowId, transitionId, userId) {
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

    const transition = await NodeTransition.findByPk(transitionId);

    if (!transition) {
      throw new Error('Transition not found');
    }

    await transition.destroy();
    return { message: 'Transition deleted successfully' };
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

  /**
     * Duplicate workflow with all nodes and transitions
     */
    async duplicateWorkflow(workflowId, userId, newName) {
        const originalWorkflow = await this.getWorkflowsById(workflowId, userId);

        if (!originalWorkflow) {
            throw new Error('Workflow not found or unauthorized');
        }

        // Create new workflow
        const duplicatedWorkflow = await Workflow.create({
            bot_id: originalWorkflow.bot_id,
            name: newName || `${originalWorkflow.name} (Copy)`,
            description: originalWorkflow.description,
            is_active: false,
        });

        // Map old node IDs to new node IDs
        const nodeIdMap = new Map();

        // Duplicate all nodes
        for (const node of originalWorkflow.WorkflowNodes || []) {
            const newNode = await WorkflowNode.create({
                workflow_id: duplicatedWorkflow.id,
                node_type: node.node_type,
                position: node.position,
                config: node.config,
            });
            nodeIdMap.set(node.id, newNode.id);
        }
                // Duplicate all transitions with new node IDs
        for (const node of originalWorkflow.WorkflowNodes || []) {
            const transitions = node.transitionsFrom || [];
            for (const transition of transitions) {
                await NodeTransition.create({
                    from_node_id: nodeIdMap.get(transition.from_node_id),
                    to_node_id: nodeIdMap.get(transition.to_node_id),
                    trigger_type: transition.trigger_type,
                    trigger_value: transition.trigger_value,
                    condition: transition.condition,
                    priority: transition.priority,
                });
            }
        }

        // Update start_node_id if it exists
        if (originalWorkflow.start_node_id) {
            await duplicatedWorkflow.update({
                start_node_id: nodeIdMap.get(originalWorkflow.start_node_id),
            });
        }

        // Duplicate workflow triggers
        const triggers = originalWorkflow.WorkflowTriggers || [];
        for (const trigger of triggers) {
            await WorkflowTrigger.create({
                workflow_id: duplicatedWorkflow.id,
                trigger_type: trigger.trigger_type,
                trigger_value: trigger.trigger_value,
                is_active: trigger.is_active,
            });
        }

        return this.getWorkflowsById(duplicatedWorkflow.id, userId);
    }

     /**
     * Publish/activate workflow
     */
    async publishWorkflow(workflowId, userId) {
        const workflow = await Workflow.findOne({
            where: { id: workflowId },
            include: [
                {
                    model: Bot,
                    where: { user_id: userId },
                },
                {
                    model: WorkflowNode,
                },
            ],
        });

        if (!workflow) {
            throw new Error('Workflow not found or unauthorized');
        }

        // Validate workflow has nodes
        if (!workflow.WorkflowNodes || workflow.WorkflowNodes.length === 0) {
            throw new Error('Cannot publish empty workflow');
        }

        // Validate start node exists
        if (!workflow.start_node_id) {
            throw new Error('Cannot publish workflow without a start node');
        }

        await workflow.update({ is_active: true });
        return workflow;
    }


    /**
     * Get workflow analytics
     */
    async getWorkflowAnalytics(workflowId, userId, { start_date, end_date }) {
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

        const whereClause = { workflow_id: workflowId };

        if (start_date || end_date) {
            whereClause.created_at = {};
            if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
            if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
        }

        const analytics = await WorkflowAnalytics.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
        });

        // Calculate summary statistics
        const summary = {
            total_sessions: analytics.filter(a => a.event_type === 'workflow_started').length,
            completed_sessions: analytics.filter(a => a.event_type === 'workflow_completed').length,
            node_visits: {},
            average_duration: null,
        };

        // Count node visits
        analytics.forEach(analytic => {
            if (analytic.node_id) {
                summary.node_visits[analytic.node_id] = 
                    (summary.node_visits[analytic.node_id] || 0) + 1;
            }
        });

        return {
            summary,
            events: analytics,
        };
    }
}

export default new WorkflowService();