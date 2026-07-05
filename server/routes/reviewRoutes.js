import express from 'express';
import { createReview, getProductReviews, getMyReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/my/reviews', authMiddleware, getMyReviews);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
