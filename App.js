import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Checkout from './pages/Checkout';
import CustomOrderPage from './pages/CustomOrders';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './admin/AdminLayout';
import UsersList from './admin/UsersList';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import Dashboard from './admin/Dashboard';

function Layout() {
  return (
    <>
      <Navbar />
      <div className="px-4 pt-20">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/custom-order" element={<CustomOrderPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<UsersList />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
