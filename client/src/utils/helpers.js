export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const calculateDiscount = (originalPrice, discountPrice) => {
  const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
  return Math.round(discount);
};

export const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'An error occurred';
};
