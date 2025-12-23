import asyncHandler from 'express-async-handler';
import chatService from '../services/chatService.js';

/**
 * @route   POST /api/chat/start
 * @desc    Start a new chat session
 * @access  Public (or can be protected based on your needs)
 */
const startChatController = asyncHandler(async (req, res) => {
  const { bot_id, external_user_id, metadata } = req.body;

  if (!bot_id) {
    res.status(400);
    throw new Error('Bot ID is required');
  }

  const chat = await chatService.startChat({
    bot_id,
    external_user_id: external_user_id || `guest_${Date.now()}`,
    metadata,
  });

  res.status(201).json({
    success: true,
    data: chat,
  });
});

/**
 * @route   POST /api/chat/:chatId/message
 * @desc    Send a message in a chat
 * @access  Public
 */
const sendMessageController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message, message_type = 'text' } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  const response = await chatService.processMessage(chatId, {
    message,
    message_type,
  });

  res.status(200).json({
    success: true,
    data: response,
  });
});

/**
 * @route   GET /api/chat/:chatId/history
 * @desc    Get chat message history
 * @access  Public
 */
const getChatHistoryController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const messages = await chatService.getChatHistory(chatId, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

/**
 * @route   GET /api/chat/:chatId
 * @desc    Get chat details
 * @access  Public
 */
const getChatDetailsController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatService.getChatDetails(chatId);

  res.status(200).json({
    success: true,
    data: chat,
  });
});

/**
 * @route   PUT /api/chat/:chatId/context
 * @desc    Update chat context/variables
 * @access  Public
 */
const updateChatContextController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { context } = req.body;

  const updatedChat = await chatService.updateChatContext(chatId, context);

  res.status(200).json({
    success: true,
    data: updatedChat,
  });
});

/**
 * @route   POST /api/chat/:chatId/end
 * @desc    End a chat session
 * @access  Public
 */
const endChatController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  await chatService.endChat(chatId);

  res.status(200).json({
    success: true,
    message: 'Chat ended successfully',
  });
});

export {
  startChatController,
  sendMessageController,
  getChatHistoryController,
  getChatDetailsController,
  updateChatContextController,
  endChatController,
};