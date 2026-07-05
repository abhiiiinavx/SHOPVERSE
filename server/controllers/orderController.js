import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { sendResponse, sendError, calculateTax, calculateShipping } from '../utils/helpers.js';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, 'Order items are required');
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return sendError(res, 404, `Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        return sendError(res, 400, `Insufficient stock for ${product.name}`);
      }

      const itemPrice = product.discountPrice || product.price;
      subtotal += itemPrice * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon && new Date() < coupon.validTill) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const tax = parseFloat(calculateTax(subtotal));
    const shippingCost = calculateShipping(0);
    const totalPrice = subtotal + tax + shippingCost - discount;

    const order = await Order.create({
      user: req.user.id,
      items: processedItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      discount: {
        code: couponCode,
        amount: discount,
      },
      totalPrice,
      orderStatus: 'pending',
    });

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalPrice: 0 });

    sendResponse(res, 201, true, 'Order created successfully', order);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to view this order');
    }

    sendResponse(res, 200, true, 'Order fetched successfully', order);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to cancel this order');
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return sendError(res, 400, 'Cannot cancel this order');
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    await order.save();

    sendResponse(res, 200, true, 'Order cancelled successfully', order);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const initializeRazorpay = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    const options = {
      amount: order.totalPrice * 100,
      currency: 'INR',
      receipt: order._id.toString(),
    };

    const payment = await razorpay.orders.create(options);

    sendResponse(res, 200, true, 'Razorpay order created', payment);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const initializeStripe = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Order #${order._id}`,
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    sendResponse(res, 200, true, 'Stripe session created', { sessionId: session.id });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  initializeRazorpay,
  initializeStripe,
};
