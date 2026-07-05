import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { categoryValidation } from '../utils/validators.js';
import handleValidationErrors from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  categoryValidation.create,
  handleValidationErrors,
  createCategory
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  categoryValidation.update,
  handleValidationErrors,
  updateCategory
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteCategory
);

export default router;
