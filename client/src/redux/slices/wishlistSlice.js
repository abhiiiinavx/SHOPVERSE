import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  wishlistIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.products = action.payload.products;
      state.wishlistIds = action.payload.products.map((p) => p._id);
    },
    addToWishlist: (state, action) => {
      if (!state.wishlistIds.includes(action.payload._id)) {
        state.products.push(action.payload);
        state.wishlistIds.push(action.payload._id);
      }
    },
    removeFromWishlist: (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
      state.wishlistIds = state.wishlistIds.filter((id) => id !== action.payload);
    },
    clearWishlist: (state) => {
      state.products = [];
      state.wishlistIds = [];
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
