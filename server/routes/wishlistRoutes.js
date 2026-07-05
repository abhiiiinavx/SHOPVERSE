import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/remove', protect, removeFromWishlist);
router.delete('/clear', protect, clearWishlist);

export default router;
