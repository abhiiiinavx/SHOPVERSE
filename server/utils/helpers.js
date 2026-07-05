import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};

const calculateTax = (amount, taxRate = 0.18) => {
  return (amount * taxRate).toFixed(2);
};

const calculateShipping = (weight, baseRate = 50) => {
  return baseRate + (weight * 10);
};

const getDiscountedPrice = (originalPrice, discountPercent) => {
  return (originalPrice - (originalPrice * discountPercent) / 100).toFixed(2);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};

const sendError = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export {
  generateToken,
  generateResetToken,
  calculateTax,
  calculateShipping,
  getDiscountedPrice,
  formatCurrency,
  sendResponse,
  sendError,
};
