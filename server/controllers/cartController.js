import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    sendResponse(res, 200, true, 'Cart fetched successfully', cart);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountPrice || product.price,
        selectedColor,
        selectedSize,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.product');

    sendResponse(res, 200, true, 'Product added to cart successfully', cart);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return sendError(res, 404, 'Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.product');

    sendResponse(res, 200, true, 'Cart updated successfully', cart);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.product');

    sendResponse(res, 200, true, 'Product removed from cart successfully', cart);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    sendResponse(res, 200, true, 'Cart cleared successfully', cart);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
