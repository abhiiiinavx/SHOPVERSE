import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getSalesData,
  getRevenueData,
  getTopProducts,
} from '../controllers/dashboardController.js';

const router = express.Router();

// Admin routes
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/sales', protect, authorize('admin'), getSalesData);
router.get('/revenue', protect, authorize('admin'), getRevenueData);
router.get('/top-products', protect, authorize('admin'), getTopProducts);

export default router;
