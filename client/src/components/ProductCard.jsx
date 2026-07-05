import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateDiscount } from '../utils/helpers';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-primary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-light dark:bg-dark h-48">
        <Link to={`/product/${product._id}`}>
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{calculateDiscount(product.price, product.discountPrice)}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist(product._id)}
          className={`absolute top-3 left-3 p-2 rounded-full transition ${
            isInWishlist
              ? 'bg-secondary text-white'
              : 'bg-white text-dark hover:bg-light'
          }`}
        >
          ♥
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-secondary transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={i < Math.floor(product.rating) ? 'fill-current' : ''}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            ({product.numOfReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-secondary">
            {formatCurrency(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm line-through text-gray-400">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p
          className={`text-xs mb-3 font-semibold ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0}
          className="w-full py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
