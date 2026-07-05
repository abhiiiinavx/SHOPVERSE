import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiShare2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import { formatCurrency, calculateDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  const { wishlistIds } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlistIds.includes(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        if (response.data.data.colors?.length > 0) {
          setSelectedColor(response.data.data.colors[0]);
        }
        if (response.data.data.sizes?.length > 0) {
          setSelectedSize(response.data.data.sizes[0]);
        }
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', {
        productId: id,
        quantity,
        selectedColor,
        selectedSize,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (isInWishlist) {
        await api.delete('/wishlist/remove', { data: { productId: id } });
        toast.success('Removed from wishlist');
      } else {
        await api.post('/wishlist/add', { productId: id });
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <MainLayout><LoadingSkeleton count={1} /></MainLayout>;
  if (!product) return <MainLayout><div className="text-center py-12">Product not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <motion.div className="mb-4 bg-white dark:bg-primary rounded-lg overflow-hidden h-96">
            {product.images?.[imageIndex]?.url ? (
              <img
                src={product.images[imageIndex].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">No Image</div>
            )}
          </motion.div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images?.map((image, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => setImageIndex(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  idx === imageIndex ? 'border-secondary' : 'border-gray-300'
                }`}
              >
                <img src={image.url} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">({product.numOfReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-secondary">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-xl line-through text-gray-400">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  Save {calculateDiscount(product.price, product.discountPrice)}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`mb-6 font-semibold ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === color
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Size</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedSize === size
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Quantity</label>
            <div className="flex items-center gap-4 w-32 border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 py-2 hover:bg-light dark:hover:bg-primary transition"
              >
                −
              </button>
              <span className="flex-1 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 py-2 hover:bg-light dark:hover:bg-primary transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
            >
              <FiShoppingCart /> Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleAddToWishlist}
              className={`py-3 px-6 rounded-lg font-semibold border-2 transition ${
                isInWishlist
                  ? 'border-secondary text-secondary bg-red-50 dark:bg-red-900 dark:bg-opacity-20'
                  : 'border-gray-300 hover:border-secondary'
              }`}
            >
              <FiHeart className={isInWishlist ? 'fill-current' : ''} />
            </motion.button>
          </div>

          {/* Share */}
          <button className="mt-4 w-full py-2 border rounded-lg hover:bg-light dark:hover:bg-primary transition flex items-center justify-center gap-2">
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
