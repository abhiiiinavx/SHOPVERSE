import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { sendEmail } from '../config/nodemailer.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;

    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    }));

    let subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      const validCoupon = await Coupon.findOne({ code: couponCode, active: true });
      if (validCoupon) {
        if (validCoupon.endDate && validCoupon.endDate < new Date()) {
          return res.status(400).json({ message: 'Coupon has expired' });
        }
        if (subtotal < validCoupon.minPurchase) {
          return res.status(400).json({ message: `Minimum purchase of ${validCoupon.minPurchase} required` });
        }
        if (validCoupon.discountType === 'percentage') {
          discount = (subtotal * validCoupon.discountValue) / 100;
          if (validCoupon.maxDiscount) {
            discount = Math.min(discount, validCoupon.maxDiscount);
          }
        } else {
          discount = validCoupon.discountValue;
        }
        coupon = validCoupon._id;
      }
    }

    const tax = subtotal * 0.18; // 18% GST
    const shipping = 50; // Fixed shipping
    const total = subtotal + tax + shipping - discount;

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      coupon
    });

    // Update coupon usage
    if (coupon) {
      await Coupon.findByIdAndUpdate(
        coupon,
        {
          $inc: { usedCount: 1 },
          $push: { usedBy: { user: req.user.id, usedAt: new Date() } }
        }
      );
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    // Send confirmation email
    const htmlContent = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: ₹${total.toFixed(2)}</p>
      <p>Payment Method: ${paymentMethod}</p>
    `;
    await sendEmail(req.user.email, 'Order Confirmation', htmlContent);

    res.status(201).json({ success: true, message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .populate('coupon')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email phone')
      .populate('coupon');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
