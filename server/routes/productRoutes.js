import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTopRatedProducts,
  searchProducts,
} from '../controllers/productController.js';
import { productValidation } from '../utils/validators.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top-rated', getTopRatedProducts);
router.get('/:id', getProductById);

// Protected routes
router.post(
  '/',
  protect,
  authorize('admin', 'seller'),
  upload.array('images', 5),
  productValidation.create,
  handleValidationErrors,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'seller'),
  productValidation.update,
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'seller'),
  deleteProduct
);

export default router;
