import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${
      isActive ? 'bg-gray-700 font-semibold' : 'font-normal'
    }`;

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav className="flex-grow space-y-4">
          <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
        </nav>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="mt-auto flex items-center px-4 py-2 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 rounded"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" />
          Logout
        </button>
      </aside>
      <main className="flex-grow p-8 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
