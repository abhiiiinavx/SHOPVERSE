import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getTrendingProducts, getNewArrivals } from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 10), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 10), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
