import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-amber-900">Mandala Artistry</h2>
          <p className="mt-2 text-sm">Bringing art and soul to your space. Handcrafted Mandala designs just for you.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/products" className="hover:underline">Products</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: support@mandalaart.com</p>
          <p className="text-sm">Phone: +91 98765 43210</p>
          <p className="text-sm mt-2">Follow us on:</p>
          <div className="flex space-x-3 mt-1">
            <a href="#" className="hover:text-purple-600">Instagram</a>
            <a href="#" className="hover:text-purple-600">Facebook</a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t text-gray-500">
        &copy; {new Date().getFullYear()} Mandala. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
