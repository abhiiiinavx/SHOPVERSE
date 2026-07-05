import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import { sendResponse, sendError, getDiscountedPrice } from '../utils/helpers.js';

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, brand, minPrice, maxPrice, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const products = await Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    sendResponse(res, 200, true, 'Products fetched successfully', {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('seller', 'name email');

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    sendResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, specifications, colors, sizes } = req.body;

    const productData = {
      name,
      description,
      price,
      category,
      brand,
      stock,
      specifications,
      colors,
      sizes,
      seller: req.user.id,
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'shopverse/products',
          });
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (error) {
          console.error('Cloudinary upload error:', error);
        }
      }
      productData.images = images;
    }

    const product = await Product.create(productData);
    await product.populate('category');

    sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to update this product');
    }

    Object.assign(product, req.body);
    await product.save();
    await product.populate('category');

    sendResponse(res, 200, true, 'Product updated successfully', product);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to delete this product');
    }

    // Delete images from cloudinary
    if (product.images.length > 0) {
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category')
      .limit(8);

    sendResponse(res, 200, true, 'Featured products fetched successfully', products);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category')
      .sort({ rating: -1 })
      .limit(8);

    sendResponse(res, 200, true, 'Top rated products fetched successfully', products);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return sendError(res, 400, 'Search query is required');
    }

    const products = await Product.find(
      { $text: { $search: query }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('category');

    sendResponse(res, 200, true, 'Search results fetched successfully', products);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTopRatedProducts,
  searchProducts,
};
