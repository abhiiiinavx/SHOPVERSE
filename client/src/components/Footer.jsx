import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">SHOPVERSE</h3>
            <p className="text-gray-300 mb-4">
              Your ultimate online shopping destination for premium products at unbeatable prices.
            </p>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-secondary transition">
                <FiFacebook />
              </a>
              <a href="#" className="hover:text-secondary transition">
                <FiTwitter />
              </a>
              <a href="#" className="hover:text-secondary transition">
                <FiInstagram />
              </a>
              <a href="#" className="hover:text-secondary transition">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2 text-gray-300">
              <Link to="/" className="hover:text-secondary transition">
                Home
              </Link>
              <Link to="/products" className="hover:text-secondary transition">
                Products
              </Link>
              <Link to="/categories" className="hover:text-secondary transition">
                Categories
              </Link>
              <Link to="/about" className="hover:text-secondary transition">
                About Us
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <nav className="space-y-2 text-gray-300">
              <Link to="/contact" className="hover:text-secondary transition">
                Contact Us
              </Link>
              <Link to="/shipping" className="hover:text-secondary transition">
                Shipping Info
              </Link>
              <Link to="/returns" className="hover:text-secondary transition">
                Returns
              </Link>
              <Link to="/faq" className="hover:text-secondary transition">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Subscribe for exclusive deals and updates.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white text-dark outline-none"
              />
              <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-red-600 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <p>&copy; 2024 SHOPVERSE. All rights reserved.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/privacy" className="hover:text-secondary transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-secondary transition">
                Terms & Conditions
              </Link>
            </div>
            <p className="text-right">Made with ❤️ by SHOPVERSE</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
