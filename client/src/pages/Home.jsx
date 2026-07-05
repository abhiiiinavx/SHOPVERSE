import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShoppingCart, FaHeart, FaTruck } from 'react-icons/fa';
import { productAPI } from '../api/endpoints.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../hooks/useCart.js';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, trendingRes, newRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getTrending(),
          productAPI.getNewArrivals(),
        ]);
        setFeatured(featuredRes.data.products);
        setTrending(trendingRes.data.products);
        setNewArrivals(newRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Slider */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to ShopVerse</h1>
          <p className="text-xl md:text-2xl mb-8">Discover amazing products at unbeatable prices</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now <FaArrowRight />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black"
        />
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <FaTruck className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400">Get your orders delivered quickly and safely</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <FaShoppingCart className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Easy Shopping</h3>
            <p className="text-gray-600 dark:text-gray-400">Browse and buy with just a few clicks</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <FaHeart className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Best Quality</h3>
            <p className="text-gray-600 dark:text-gray-400">Premium products with guaranteed quality</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trending.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">New Arrivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8">Get exclusive offers and updates delivered to your inbox</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              required
            />
            <button type="submit" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
