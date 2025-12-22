import workflowService from '../services/workflowService.js';
import asyncHandler from 'express-async-handler';

/**
 * @route   POST /api/workflows/:workflowId/nodes
 * @desc    Add node to workflow
 * @access  Private
 */
const addNodeController = asyncHandler(async (req, res) => {
  const { node_type, position, config } = req.body;

  if (!node_type) {
    return res.status(400).json({
      success: false,
      message: 'Node type is required',
    });
  }

  const node = await workflowService.addNode(
    req.params.workflowId,
    req.user.id,
    { node_type, position, config }
  );

  res.status(201).json({ success: true, data: node });
});

/**
 * @route   POST /api/workflows/:workflowId/transitions
 * @desc    Add transition between nodes
 * @access  Private
 */
const addTransitionController = asyncHandler(async (req, res) => {
  const { from_node_id, to_node_id, trigger_type, trigger_value, condition, priority } = req.body;

  if (!from_node_id || !to_node_id) {
    return res.status(400).json({
      success: false,
      message: 'from_node_id and to_node_id are required',
    });
  }

  const transition = await workflowService.addTransition(
    req.params.workflowId,
    req.user.id,
    { from_node_id, to_node_id, trigger_type, trigger_value, condition, priority }
  );

  res.status(201).json({ success: true, data: transition });
});

/**
 * @route   PUT /api/workflows/:workflowId/nodes/:nodeId
 * @desc    Update node
 * @access  Private
 */
const updateNodeController = asyncHandler(async (req, res) => {
  const { node_type, position, config } = req.body;
  const updates = {};

  if (node_type !== undefined) updates.node_type = node_type;
  if (position !== undefined) updates.position = position;
  if (config !== undefined) updates.config = config;

  const node = await workflowService.updateNode(
    req.params.workflowId,
    req.params.nodeId,
    req.user.id,
    updates
  );

  res.status(200).json({ success: true, data: node });
});

/**
 * @route   DELETE /api/workflows/:workflowId/nodes/:nodeId
 * @desc    Delete node
 * @access  Private
 */
const deleteNodeController = asyncHandler(async (req, res) => {
  await workflowService.deleteNode(
    req.params.workflowId,
    req.params.nodeId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Node deleted successfully',
  });
});

/**
 * @route   DELETE /api/workflows/:workflowId/transitions/:transitionId
 * @desc    Delete transition
 * @access  Private
 */
const deleteTransitionController = asyncHandler(async (req, res) => {
  await workflowService.deleteTransition(
    req.params.workflowId,
    req.params.transitionId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Transition deleted successfully',
  });
});

export {
  addNodeController,
  addTransitionController,
  updateNodeController,
  deleteNodeController,
  deleteTransitionController,
};