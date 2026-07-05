import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalReviews = await Review.countDocuments();

    const orders = await Order.find().select('total createdAt orderStatus');
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const topProducts = await Product.find()
      .sort({ numReviews: -1 })
      .limit(5);

    const orderStatuses = {};
    orders.forEach(order => {
      orderStatuses[order.orderStatus] = (orderStatuses[order.orderStatus] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalReviews,
        totalRevenue
      },
      recentOrders,
      topProducts,
      orderStatuses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesChart = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'completed' }).select('total createdAt');

    const chartData = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      chartData[date] = (chartData[date] || 0) + order.total;
    });

    const labels = Object.keys(chartData).sort();
    const data = labels.map(label => chartData[label]);

    res.json({ success: true, labels, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'completed' }).select('total createdAt');

    const months = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    orders.forEach(order => {
      const month = order.createdAt.getMonth();
      const monthKey = monthNames[month];
      months[monthKey] = (months[monthKey] || 0) + order.total;
    });

    const labels = monthNames;
    const data = labels.map(month => months[month] || 0);

    res.json({ success: true, labels, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');

    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product._id.toString();
        productSales[productId] = (productSales[productId] || 0) + item.quantity;
      });
    });

    const topProducts = await Product.find()
      .sort({ 'sales': -1 })
      .limit(10);

    res.json({ success: true, products: topProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerMetrics = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const activeCustomers = await User.countDocuments({ status: 'active' });
    const orders = await Order.find();
    const avgOrderValue = orders.length > 0 ? orders.reduce((acc, o) => acc + o.total, 0) / orders.length : 0;

    res.json({
      success: true,
      metrics: {
        totalCustomers,
        activeCustomers,
        avgOrderValue: avgOrderValue.toFixed(2),
        totalOrders: orders.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
