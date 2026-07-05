import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import wishlistReducer from './wishlistSlice.js';
import productReducer from './productSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    product: productReducer,
  },
});

export default store;
