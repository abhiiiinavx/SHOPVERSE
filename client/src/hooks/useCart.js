import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartItem, clearCart } from '../redux/cartSlice.js';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleAddToCart = (product, quantity = 1, color = '', size = '') => {
    dispatch(addToCart({ product, quantity, color, size }));
    toast.success('Added to cart');
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Removed from cart');
  };

  const handleUpdateCart = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
    } else {
      dispatch(updateCartItem({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateCart,
    handleClearCart,
    getTotalPrice,
    getTotalItems,
  };
};
