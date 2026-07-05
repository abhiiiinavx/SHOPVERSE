import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import Category from '../models/Category.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sort, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price-low':
          sortOption = { price: 1 };
          break;
        case 'price-high':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, brand, stock, sku, colors, sizes, specifications } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload_stream(
            { folder: 'shopverse/products', resource_type: 'auto' },
            async (error, result) => {
              if (error) throw error;
              images.push({
                public_id: result.public_id,
                url: result.secure_url
              });
            }
          );
          result.end(file.buffer);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || price,
      category,
      brand,
      stock,
      sku,
      colors: colors ? JSON.parse(colors) : [],
      sizes: sizes ? JSON.parse(sizes) : [],
      specifications: specifications ? JSON.parse(specifications) : {},
      images,
      seller: req.user.id
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, brand, stock, sku, colors, sizes, specifications } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discountPrice) product.discountPrice = discountPrice;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (sku) product.sku = sku;
    if (colors) product.colors = JSON.parse(colors);
    if (sizes) product.sizes = JSON.parse(sizes);
    if (specifications) product.specifications = JSON.parse(specifications);

    if (req.files && req.files.length > 0) {
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      product.images = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'shopverse/products' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          uploadStream.end(file.buffer);
        });
        product.images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    product.updatedAt = Date.now();
    await product.save();

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category')
      .limit(10);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ numReviews: -1 })
      .limit(10);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
