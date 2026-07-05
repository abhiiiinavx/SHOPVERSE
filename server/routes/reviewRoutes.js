import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { reviewValidation } from '../utils/validators.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post(
  '/',
  protect,
  reviewValidation.create,
  handleValidationErrors,
  createReview
);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
