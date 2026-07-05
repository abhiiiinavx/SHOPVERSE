import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout.jsx';
import { FaHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { removeFromWishlist } from '../redux/wishlistSlice.js';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const { handleAddToCart } = useCart();

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  if (wishlist.items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
          <FaHeart className="text-6xl text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Add items to your wishlist to save them for later</p>
          <Link
            to="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
          >
            Continue Shopping <FaArrowRight />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-48">
                  {item.images?.[0] && (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <FaHeart />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-2">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(item.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">({item.numReviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">₹{item.discountPrice || item.price}</span>
                    {item.discountPrice && (
                      <span className="text-sm line-through text-gray-500">₹{item.price}</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <Link
                      to={`/products/${item._id}`}
                      className="block w-full text-center border border-primary text-primary py-2 rounded-lg hover:bg-primary/5 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
