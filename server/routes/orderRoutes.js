import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder, getAllOrders } from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.put('/:id/cancel', authMiddleware, cancelOrder);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);

export default router;
