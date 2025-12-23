import express from 'express';
import {
  registerUserController,
  loginUserController,
  getUserProfileController,
} from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUserController);
router.post('/login', loginUserController);
// Protected routes
router.get('/profile', protect, getUserProfileController);

export default router;