import workflowService from '../services/workflowService.js';
import asyncHandler from 'express-async-handler';

/**
 * @route   POST /api/workflows
 * @desc    Create a new workflow
 * @access  Private
 */

const createWorkflowController = asyncHandler(async (req, res) => {
    const {bot_id, name, description, start_node_id} = req.body;

    if(!bot_id || !name) {
        return res.status(400).json({
            success: false,
            message: "bot credentials are required"
        });
    }

    const workflow = await workflowService.createWorkflow(req.user.id, {
        bot_id,
        name,
        description,
        start_node_id
    });

    res.status(201).json({ success: true, data: workflow });
});

/**
 * @route   GET /api/workflows/bot/:botId
 * @desc    Get workflows for a bot
 * @access  Private
 */

const getWorkflowsController = asyncHandler(async (req, res) => {
    const { bot_id } = req.params;

    const workflows = await workflowService.getWorkflowsByBot(bot_id, req.user.id);

    res.status(200).json({ success: true, count: workflows.length, data: workflows });
});

/**
 * @route   GET /api/workflows/:id
 * @desc    Get workflow by id with node and transitions
 * @access  Private
 */

const getWorkflowByIdController = asyncHandler(async (req, res) => {
    const workflow = await workflowService.getWorkflowsById(req.params.id, req.user.id);

    res.status(200).json({ success: true, data: workflow });
})

/**
 * @route  PUT /api/workflows/:id
 * @desc   Update workflow
 * @access Private
 */

const updateWorkflowController = asyncHandler(async (req, res) => {
    const {name, description, is_active, start_node_id } = req.body;
    const updates = {};

    if(name !== undefined) updates.name = name;
    if(description !== undefined) updates.description = description;
    if(is_active !== undefined) updates.is_active = is_active;
    if(start_node_id !== undefined) updates.start_node_id = start_node_id;

    const workflow = await workflowService.updateWorkflow(
        req.params.id,
        req.user.id,
        updates
    )

    res.status(200).json({ success: true, data: workflow });
})



/**
 * @route   DELETE /api/workflows/:id
 * @desc    Delete workflow
 * @access  Private
 */
const deleteWorkflowController = asyncHandler(async (req, res) => {
  await workflowService.deleteWorkflow(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Workflow deleted successfully',
  });
});

/**
 * @route POST /api/workflows/:id/duplicate
 * @desc  Duplicate workflow
 * @access Private
 */

const duplicateWorkflowController = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const workflow  = await workflowService.duplicateWorkflow( //will create the duplicate function in service
        req.params.id,
        req.user.id,
        name
    )
})

/**
 * @route  POST /api/workflows/:id/publish
 * @desc   Publish workflow
 * @access Private
 */

const publishWorkflowController = asyncHandler(async (req, res) => {
    const workflow = await workflowService.publishWorkflow(
        req.params.id,
        req.user.id
    );


    res.status(200).json({
        success: true,
        message: 'Workflow published successfully',
        data: workflow,
    })
});

/**
 * @route   GET /api/workflows/:id/analytics
 * @desc    Get workflow analytics
 * @access  Private
 */
const getWorkflowAnalyticsController = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;

  const analytics = await workflowService.getWorkflowAnalytics(
    req.params.id,
    req.user.id,
    { start_date, end_date }
  );

  res.status(200).json({ success: true, data: analytics });
});


export {
    createWorkflowController,
    getWorkflowsController,
    getWorkflowByIdController,
    updateWorkflowController,
    deleteWorkflowController,
    duplicateWorkflowController,
    publishWorkflowController,
    getWorkflowAnalyticsController,
}