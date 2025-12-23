import express from 'express';
import {
  startChatController,
  sendMessageController,
  getChatHistoryController,
  getChatDetailsController,
  updateChatContextController,
  endChatController,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/start', startChatController);
router.post('/:chatId/message', sendMessageController);
router.get('/:chatId/history', getChatHistoryController);
router.get('/:chatId', getChatDetailsController);
router.put('/:chatId/context', updateChatContextController);
router.post('/:chatId/end', endChatController);

export default router;