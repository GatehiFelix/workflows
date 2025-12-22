import express from 'express';
import {
    addNodeController,
    addTransitionController,
    updateNodeController,
    deleteNodeController,
    deleteTransitionController,
} from '../controllers/workflowNodeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/:workflowId/nodes', addNodeController);
router.put('/:workflowId/nodes/:nodeId', updateNodeController);
router.delete('/:workflowId/nodes/:nodeId', deleteNodeController);

router.post('/:workflowId/transitions', addTransitionController);
router.delete('/:workflowId/transitions/:transitionId', deleteTransitionController);

export default router;
