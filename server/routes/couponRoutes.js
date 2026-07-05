import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCoupons);
router.post('/validate', validateCoupon);

// Admin routes
router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;
