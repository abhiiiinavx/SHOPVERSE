import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { userAPI, orderAPI } from '../api/endpoints.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          userAPI.getProfile(),
          orderAPI.getOrders(),
        ]);
        setProfile(profileRes.data.user);
        setOrders(ordersRes.data.orders);
        setFormData(profileRes.data.user);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.data.success) {
        setProfile(response.data.user);
        setEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6"
            >
              <div className="text-center mb-6">
                <img
                  src={profile?.avatar || 'https://via.placeholder.com/150'}
                  alt={profile?.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{profile?.email}</p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaPhone className="text-primary" />
                  <span>{profile?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="text-primary" />
                  <span className="text-sm truncate">{profile?.email}</span>
                </div>
                {profile?.address?.city && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{profile.address.city}, {profile.address.state}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </motion.div>

            {/* Edit Form or Orders */}
            {editing ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleUpdateProfile}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="street"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                    placeholder="Street"
                    className="col-span-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.address?.state || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                          <span className={`px-3 py-1 rounded text-sm font-semibold ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>₹{order.total.toFixed(2)}</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
