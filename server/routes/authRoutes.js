import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { register, login, logout, forgotPassword, resetPassword, getCurrentUser } from '../controllers/authController.js';
import { authValidation } from '../utils/validators.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

router.post('/register', authValidation.register, handleValidationErrors, register);
router.post('/login', authValidation.login, handleValidationErrors, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', authValidation.forgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password/:token', authValidation.resetPassword, handleValidationErrors, resetPassword);
router.get('/me', protect, getCurrentUser);

export default router;
