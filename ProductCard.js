import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1.5 group cursor-pointer">
      <Link to={`/product/${product._id}`} className="block">
        <div className="overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-amber-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{product.category}</p>
          <p className="text-green-700 font-semibold">₹{product.price}</p>
        </div>
      </Link>
    </div>
  );
}
