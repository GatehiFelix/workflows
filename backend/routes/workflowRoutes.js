import express from 'express';
import {
    createWorkflowController,
    getWorkflowsController,
    getWorkflowByIdController,
    updateWorkflowController,
    deleteWorkflowController,
    duplicateWorkflowController,
    publishWorkflowController,
    getWorkflowAnalyticsController,
} from '../controllers/workflowControllers.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.use(protect);

router.post('/', createWorkflowController);
router.get('/bot/:bot_id', getWorkflowsController);
router.get('/:id', getWorkflowByIdController);
router.put('/:id', updateWorkflowController);
router.delete('/:id', deleteWorkflowController);

//workflow actions
router.post('/:id/duplicate', duplicateWorkflowController);
router.post('/:id/publish', publishWorkflowController);
router.get('/:id/analytics', getWorkflowAnalyticsController);

export default router;