# ShopVerse

A premium online shopping platform inspired by Amazon, Flipkart, Myntra, and Shopify.

## 🚀 Features

### Authentication
- User Registration & Login
- JWT Authentication
- Role-based Access (Admin/User)
- Forgot Password & Reset Password
- Profile Management

### Product Management
- Browse Products by Categories
- Advanced Search & Filters
- Product Ratings & Reviews
- Multiple Product Images
- Stock Management
- Wishlist

### Shopping
- Shopping Cart
- Checkout Process
- Coupon/Discount Codes
- Multiple Payment Options (Razorpay, Stripe, COD)
- Order History

### Admin Dashboard
- Product Management (Add, Edit, Delete)
- Order Management
- Customer Management
- Analytics & Sales Reports
- Inventory Management

### UI/UX
- Responsive Design (Mobile, Tablet, Desktop)
- Dark Mode Support
- Glassmorphism Design
- Smooth Animations
- Loading Skeletons
- Modern Cards & Components

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Framer Motion
- React Hook Form
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt Password Hashing
- Multer & Cloudinary (Image Upload)
- Nodemailer (Email Notifications)
- Helmet (Security)
- Morgan (Logging)

## 📁 Project Structure

```
shopverse/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable Components
│   │   ├── pages/         # Page Components
│   │   ├── hooks/         # Custom Hooks
│   │   ├── redux/         # Redux Store
│   │   ├── utils/         # Utility Functions
│   │   ├── styles/        # Global Styles
│   │   ├── assets/        # Images, Icons
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                # Express Backend
│   ├── models/            # MongoDB Models
│   ├── controllers/       # Route Controllers
│   ├── routes/            # API Routes
│   ├── middleware/        # Custom Middleware
│   ├── utils/             # Utility Functions
│   ├── config/            # Configuration Files
│   ├── server.js
│   └── package.json
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shopverse.git
cd shopverse
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Environment Setup

1. Create `.env` file in `server/` directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=your_email_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

2. Create `.env` file in `client/` directory:
```
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin)

## 🔐 Security Features

- JWT Token Authentication
- bcrypt Password Hashing
- Helmet.js for HTTP Headers
- CORS Protection
- Input Validation & Sanitization
- Rate Limiting
- Protected API Routes

## 📦 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add to `.env` file

## 📄 License

MIT License

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
