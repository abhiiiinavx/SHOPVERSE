import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    sendResponse(res, 200, true, 'Wishlist fetched successfully', wishlist);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    await wishlist.populate('products');

    sendResponse(res, 200, true, 'Product added to wishlist successfully', wishlist);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return sendError(res, 404, 'Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    sendResponse(res, 200, true, 'Product removed from wishlist successfully', wishlist);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return sendError(res, 404, 'Wishlist not found');
    }

    wishlist.products = [];
    await wishlist.save();

    sendResponse(res, 200, true, 'Wishlist cleared successfully', wishlist);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
