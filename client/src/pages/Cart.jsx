import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout.jsx';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { removeFromCart, updateCartItem } from '../redux/cartSlice.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemove(id);
    } else {
      dispatch(updateCartItem({ id, quantity }));
    }
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
          <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div className="bg-white dark:bg-gray-800 rounded-lg">
                {cart.items.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-primary transition mb-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.color && `Color: ${item.color}`}
                        {item.size && ` | Size: ${item.size}`}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary">₹{item.product.price}</span>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-3 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 h-fit sticky top-20"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span className="font-semibold">₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">₹{(getTotalPrice() + 50 + (getTotalPrice() * 0.18)).toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition font-semibold text-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="block w-full mt-4 border border-primary text-primary py-3 rounded-lg hover:bg-primary/5 transition font-semibold text-center"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
