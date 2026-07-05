import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    sendResponse(res, 200, true, 'Dashboard stats fetched successfully', {
      totalOrders,
      totalUsers,
      totalProducts,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getSalesData = async (req, res) => {
  try {
    const { period = '7days' } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === '7days') {
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === '30days') {
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    } else if (period === '90days') {
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: dateFilter,
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendResponse(res, 200, true, 'Sales data fetched successfully', salesData);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getRevenueData = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);

    sendResponse(res, 200, true, 'Revenue data fetched successfully', revenueData);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    ]);

    sendResponse(res, 200, true, 'Top products fetched successfully', topProducts);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getDashboardStats,
  getSalesData,
  getRevenueData,
  getTopProducts,
};
