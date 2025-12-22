import express from 'express';
import {
    createBotController,
    getBotsController,
    getBotByIdController,
    updateBotController,
    deleteBotController
} from '../controllers/botControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBotController);
router.get('/', getBotsController);
router.get('/:id', getBotByIdController);
router.put('/:id', updateBotController);
router.delete('/:id', deleteBotController);