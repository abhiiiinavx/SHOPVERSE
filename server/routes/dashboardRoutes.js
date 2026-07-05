import express from 'express';
import { getDashboardStats, getSalesChart, getRevenueChart, getTopSellingProducts, getCustomerMetrics } from '../controllers/dashboardController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/sales-chart', authMiddleware, adminMiddleware, getSalesChart);
router.get('/revenue-chart', authMiddleware, adminMiddleware, getRevenueChart);
router.get('/top-products', authMiddleware, adminMiddleware, getTopSellingProducts);
router.get('/customer-metrics', authMiddleware, adminMiddleware, getCustomerMetrics);

export default router;
