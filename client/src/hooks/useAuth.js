import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import api from '../utils/api';

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: 'auth/setLoading', payload: true });
        const response = await api.post('/auth/login', { email, password });
        dispatch({
          type: 'auth/setUser',
          payload: response.data.data,
        });
        return response.data.data;
      } catch (error) {
        dispatch({ type: 'auth/setError', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'auth/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (name, email, password, phone) => {
      try {
        dispatch({ type: 'auth/setLoading', payload: true });
        const response = await api.post('/auth/register', {
          name,
          email,
          password,
          phone,
        });
        dispatch({
          type: 'auth/setUser',
          payload: response.data.data,
        });
        return response.data.data;
      } catch (error) {
        dispatch({ type: 'auth/setError', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'auth/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'auth/logout' });
  }, [dispatch]);

  return {
    auth,
    login,
    register,
    logout,
  };
};

export default useAuth;
