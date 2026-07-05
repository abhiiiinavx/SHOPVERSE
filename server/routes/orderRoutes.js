import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  initializeRazorpay,
  initializeStripe,
} from '../controllers/orderController.js';
import { orderValidation } from '../utils/validators.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

// User routes
router.post(
  '/',
  protect,
  orderValidation.create,
  handleValidationErrors,
  createOrder
);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Payment initialization
router.post('/razorpay/initialize', protect, initializeRazorpay);
router.post('/stripe/initialize', protect, initializeStripe);

export default router;
