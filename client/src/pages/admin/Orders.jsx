import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { orderAPI } from '../api/endpoints.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders({ status: filter !== 'all' ? filter : undefined });
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Orders</h1>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order ID</th>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Items</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-3 font-semibold text-primary">#{order._id.slice(-6)}</td>
                      <td className="px-6 py-3">{order.userId?.name}</td>
                      <td className="px-6 py-3 font-semibold">₹{order.total?.toFixed(2)}</td>
                      <td className="px-6 py-3">{order.orderItems?.length} items</td>
                      <td className="px-6 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1 rounded text-sm font-semibold border-0 outline-none cursor-pointer ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            order.orderStatus === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">No orders found</div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
