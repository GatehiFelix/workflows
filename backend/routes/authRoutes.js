import express from 'express';
import {
  registerController,
  loginController,
  getUserProfileController,
} from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);

// Protected routes
router.get('/profile', protect, getUserProfileController);

export default router;