import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 100000,
    search: '',
    sort: 'newest',
    page: 1,
  },
  pagination: {
    total: 0,
    pages: 0,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setProducts, setLoading, setError, setFilters, setPagination, resetFilters } = productSlice.actions;
export default productSlice.reducer;
