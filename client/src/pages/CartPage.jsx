import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const tax = totalPrice * 0.18;
  const shipping = 50;
  const finalPrice = totalPrice + tax + shipping - discount;

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put('/cart/update', { productId, quantity: newQuantity });
      dispatch({ type: 'cart/updateCartItem', payload: { productId, quantity: newQuantity } });
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete('/cart/remove', { data: { productId } });
      dispatch({ type: 'cart/removeFromCart', payload: productId });
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setLoading(true);
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        totalAmount: totalPrice,
      });
      setDiscount(response.data.data.discount);
      toast.success('Coupon applied!');
    } catch (error) {
      toast.error('Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-red-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.product._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-primary rounded-lg p-4 flex gap-4 shadow-lg"
            >
              {/* Image */}
              <Link
                to={`/product/${item.product._id}`}
                className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-light dark:bg-dark"
              >
                {item.product.images?.[0]?.url ? (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">No Image</div>
                )}
              </Link>

              {/* Details */}
              <div className="flex-1">
                <Link
                  to={`/product/${item.product._id}`}
                  className="font-semibold hover:text-secondary transition"
                >
                  {item.product.name}
                </Link>
                <p className="text-secondary font-bold">{formatCurrency(item.price)}</p>
                <div className="flex gap-2 mt-2">
                  {item.selectedColor && (
                    <span className="text-xs bg-light dark:bg-dark px-2 py-1 rounded">Color: {item.selectedColor}</span>
                  )}
                  {item.selectedSize && (
                    <span className="text-xs bg-light dark:bg-dark px-2 py-1 rounded">Size: {item.selectedSize}</span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 border rounded-lg">
                <button
                  onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                  className="p-1 hover:bg-light dark:hover:bg-dark transition"
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                  className="p-1 hover:bg-light dark:hover:bg-dark transition"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {/* Total */}
              <div className="text-right w-24">
                <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="text-red-600 hover:text-red-700 mt-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-primary rounded-lg p-6 shadow-lg h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {/* Coupon */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-dark outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={loading}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 border-t pt-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6 text-xl font-bold flex justify-between">
            <span>Total</span>
            <span className="text-secondary">{formatCurrency(finalPrice)}</span>
          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold text-center hover:shadow-lg transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
