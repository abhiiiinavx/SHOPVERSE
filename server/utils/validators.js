import { body, param, query } from 'express-validator';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const authValidation = {
  register: [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  ],
  login: [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  forgotPassword: [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  ],
  resetPassword: [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
};

const productValidation = {
  create: [
    body('name').notEmpty().withMessage('Product name is required').trim(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().trim(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be positive'),
  ],
};

const categoryValidation = {
  create: [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('description').optional().trim(),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').optional().trim(),
  ],
};

const orderValidation = {
  create: [
    body('items').isArray().withMessage('Items must be an array'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').isIn(['cod', 'razorpay', 'stripe']).withMessage('Invalid payment method'),
  ],
};

const reviewValidation = {
  create: [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required').trim(),
  ],
};

export {
  validateEmail,
  validatePassword,
  authValidation,
  productValidation,
  categoryValidation,
  orderValidation,
  reviewValidation,
};
