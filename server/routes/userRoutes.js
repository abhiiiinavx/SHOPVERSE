import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);

export default router;
