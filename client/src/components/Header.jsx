import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import { useCart } from '../hooks/useCart.js';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { logout } from '../redux/authSlice.js';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useCart();
  const auth = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-dark dark:text-white">ShopVerse</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white outline-none"
              />
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              <FaHeart className="text-lg" />
              {wishlist.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              <FaShoppingCart className="text-lg" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {auth.isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                  <FaUser className="text-lg" />
                </button>
                <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block p-2">
                  <p className="px-4 py-2 text-sm font-semibold">{auth.user?.name}</p>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    My Orders
                  </Link>
                  {auth.user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-200 dark:border-gray-800">
          <Link to="/products" className="hover:text-primary transition">All Products</Link>
          <Link to="/products?sort=trending" className="hover:text-primary transition">Trending</Link>
          <Link to="/products?sort=newest" className="hover:text-primary transition">New Arrivals</Link>
          <Link to="/products?sort=price-low" className="hover:text-primary transition">Best Deals</Link>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            <Link to="/products" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              All Products
            </Link>
            <Link to="/products?sort=trending" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Trending
            </Link>
            <Link to="/products?sort=newest" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              New Arrivals
            </Link>
            <Link to="/products?sort=price-low" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Best Deals
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
