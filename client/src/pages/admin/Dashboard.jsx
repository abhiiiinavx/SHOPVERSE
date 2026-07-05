import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { adminAPI } from '../api/endpoints.js';
import { motion } from 'framer-motion';
import { FaBox, FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FaBox,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FaShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: FaChartLine,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-4 rounded-lg text-white text-2xl`}>
                    <Icon />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="py-3 font-semibold text-primary">#{order._id.slice(-6)}</td>
                    <td className="py-3">{order.userId?.name}</td>
                    <td className="py-3">₹{order.total?.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
