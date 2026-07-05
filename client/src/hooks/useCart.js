import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import api from '../utils/api';

const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get('/cart');
      dispatch({ type: 'cart/setCart', payload: response.data.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId, quantity, selectedColor, selectedSize) => {
      try {
        const response = await api.post('/cart/add', {
          productId,
          quantity,
          selectedColor,
          selectedSize,
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const removeFromCart = useCallback(async (productId) => {
    try {
      await api.delete('/cart/remove', { data: { productId } });
    } catch (error) {
      throw error;
    }
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
  };
};

export default useCart;
