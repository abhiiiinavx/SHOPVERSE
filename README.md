# SHOPVERSE - Premium E-Commerce Platform

## Project Overview

SHOPVERSE is an enterprise-level, production-ready Full Stack MERN E-Commerce Website inspired by Amazon, Flipkart, Myntra, and Shopify. It features a premium modern UI with advanced functionality including user authentication, product management, shopping cart, wishlist, orders, payments, and comprehensive admin dashboard.

## Tech Stack

### Frontend
- **React.js** (Vite) - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image hosting
- **Nodemailer** - Email sending
- **Helmet** - Security middleware
- **Morgan** - Logging
- **CORS** - Cross-origin requests
- **Express Validator** - Input validation

### Deployment
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **MongoDB Atlas** - Database hosting

## Project Structure

```
SHOPVERSE/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── redux/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── assets/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
├── .env.example
├── README.md
└── .gitignore
```

## Features

### Authentication
- User Registration and Login
- JWT Authentication
- Password Hashing with bcrypt
- Role-Based Access Control (Admin & User)
- Protected Routes
- Profile Management
- Forgot & Reset Password

### Product Management
- Add, Edit, Delete Products
- Multiple Image Upload
- Category Management
- Inventory Management
- Product Specifications
- Reviews and Ratings
- Stock Management

### Shopping
- Shopping Cart
- Wishlist
- Product Search with Filters
- Category & Brand Filtering
- Price Range Filtering
- Advanced Sorting
- Product Recommendations

### Checkout & Payment
- Secure Checkout Process
- Multiple Payment Methods (COD, Razorpay, Stripe)
- Order Summary
- Shipping Details
- Tax Calculation
- Coupon/Discount Management

### Orders
- Place Orders
- Order Tracking
- Order History
- Invoice Generation
- Order Status Updates
- Cancel Orders

### Admin Dashboard
- Sales Analytics
- Revenue Charts
- Order Management
- Customer Management
- Product Management
- User Management
- Category Management
- Inventory Management
- Coupon Management
- Review Management
- Settings

### Additional Features
- Dark/Light Mode
- Responsive Design (Mobile, Tablet, Desktop)
- Email Notifications
- Product Comparison
- Recently Viewed Products
- Glassmorphism Design
- Smooth Animations
- Loading Skeletons
- SEO Friendly URLs
- PWA Support
- Offline Support

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas Account
- Cloudinary Account
- Razorpay/Stripe Account (Optional)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp ../.env.example .env
```

4. Update `.env` with your configuration

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Running the Project

### Development Mode

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Production Build

```bash
# Backend
cd server
npm run start

# Frontend
cd client
npm run build
npm run preview
```

## Environment Variables

See `.env.example` for all required environment variables.

### Backend Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `CLOUDINARY_*` - Cloudinary credentials
- `SMTP_*` - Email configuration
- `RAZORPAY_*` - Razorpay payment credentials
- `STRIPE_*` - Stripe payment credentials

### Frontend Variables
- `VITE_API_URL` - Backend API URL

## MongoDB Setup

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add connection string to `.env` file as `MONGODB_URI`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/search/query` - Search products

### Cart Endpoints
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/invoice` - Download invoice

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Review Endpoints
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist Endpoints
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Coupon Endpoints
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/sales` - Get sales data
- `GET /api/dashboard/revenue` - Get revenue data

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create account and cluster
2. Configure network access
3. Create database user
4. Get connection string
5. Add to backend environment variables

## Security
- Helmet for HTTP headers
- Rate limiting
- Input validation
- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- SQL injection prevention
- XSS protection

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- CDN integration
- Minification
- Compression

## License
MIT

## Contributing
Contributions are welcome! Please follow the code style and create pull requests.

## Support
For issues and questions, please create an issue on GitHub.
