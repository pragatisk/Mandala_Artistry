import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const location = useLocation();

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setCartCount(0);
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  const refreshUser = () => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
    fetchCartCount();
  };

  useEffect(() => {
    refreshUser();
    window.addEventListener('userUpdated', refreshUser);
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => {
      window.removeEventListener('userUpdated', refreshUser);
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userUpdated'));
    window.dispatchEvent(new Event('cartUpdated'));
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow px-6 py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-50">
        <Link
          to="/"
          className="flex items-center cursor-pointer space-x-2 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/assets/logo.png"
            alt="Mandala logo"
            className="h-16 w-auto object-contain"
          />
          <span className="text-lg font-bold text-amber-900">Mandala Artistry</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          <Link
            to="/"
            className={`relative transition font-semibold hover:text-amber-600 ${
              isActive('/')
                ? 'text-amber-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-amber-600'
                : 'text-gray-700'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`relative transition font-semibold hover:text-amber-600 ${
              isActive('/products')
                ? 'text-amber-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-amber-600'
                : 'text-gray-700'
            }`}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`relative transition font-semibold hover:text-amber-600 ${
              isActive('/about')
                ? 'text-amber-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-amber-600'
                : 'text-gray-700'
            }`}
          >
            About
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 font-semibold text-amber-600 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          <div ref={desktopDropdownRef} className="relative">
            <button onClick={() => setDropdownOpen((prev) => !prev)}>
              <UserIcon className="w-6 h-6 font-semibold text-amber-600 cursor-pointer" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded text-sm z-20">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 font-semibold text-gray-700">
                      {user.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)}>
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow transform transition-transform duration-300 ease-in-out z-40 p-5 pt-20 flex flex-col space-y-4 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className={`${isActive('/') ? 'text-amber-600 font-semibold underline' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/products"
          onClick={() => setMobileMenuOpen(false)}
          className={`${isActive('/products') ? 'text-amber-600 font-semibold underline' : ''}`}
        >
          Products
        </Link>
        <Link
          to="/about"
          onClick={() => setMobileMenuOpen(false)}
          className={`${isActive('/about') ? 'text-amber-600 font-semibold underline' : ''}`}
        >
          About
        </Link>
        <Link
          to="/cart"
          onClick={() => setMobileMenuOpen(false)}
          className="relative"
        >
          <ShoppingCartIcon className="w-6 h-6 font-semibold text-amber-600 inline-block" />
        </Link>

        {!user ? (
          <>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              Signup
            </Link>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold">{user.username}</div>
            <button onClick={handleLogout} className="text-left">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
