import express from 'express';
import { getProfile, updateProfile, getAllUsers, getUserById, updateUserStatus, deleteUser } from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
