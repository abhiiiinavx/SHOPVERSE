import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { wishlistIds } = useSelector((state) => state.wishlist);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-secondary">SHOPVERSE</div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-8 bg-light dark:bg-dark rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white hover:bg-red-600 transition"
            >
              <FiSearch />
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-xl hover:text-secondary transition"
            >
              <FiHeart />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-xl hover:text-secondary transition"
            >
              <FiShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-xl hover:text-secondary transition">
                  <FiUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-light dark:hover:bg-dark rounded-t-lg"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-light dark:hover:bg-dark"
                  >
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-light dark:hover:bg-dark"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-light dark:hover:bg-dark rounded-b-lg text-secondary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xl hover:text-secondary transition"
              >
                <FiUser />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-dark outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg"
                >
                  <FiSearch />
                </button>
              </div>
            </form>
            <nav className="space-y-2">
              <Link
                to="/products"
                className="block py-2 hover:text-secondary transition"
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="block py-2 hover:text-secondary transition"
              >
                Categories
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:text-secondary transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 hover:text-secondary transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
