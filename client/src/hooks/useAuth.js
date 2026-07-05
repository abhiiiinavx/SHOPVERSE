import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../api/endpoints.js';
import { loginSuccess, logout } from '../redux/authSlice.js';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          if (response.data.success) {
            dispatch(loginSuccess({ user: response.data.user, token }));
          }
        } catch (error) {
          dispatch(logout());
        }
      }
    };

    verifyToken();
  }, [dispatch]);

  return auth;
};

export const useAuthActions = () => {
  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        toast.success('Login successful');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await authAPI.register({ name, email, password, confirmPassword });
      if (response.data.success) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        toast.success('Registration successful');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return { login, register, logoutUser };
};
