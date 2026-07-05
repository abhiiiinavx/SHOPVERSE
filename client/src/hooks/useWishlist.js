import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import api from '../utils/api';

const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await api.get('/wishlist');
      dispatch({
        type: 'wishlist/setWishlist',
        payload: response.data.data,
      });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [dispatch]);

  const addToWishlist = useCallback(async (productId) => {
    try {
      await api.post('/wishlist/add', { productId });
    } catch (error) {
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      await api.delete('/wishlist/remove', { data: { productId } });
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};

export default useWishlist;
