import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { UserIcon, ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [ usersRes, productsRes, ordersRes ] = await Promise.all([
          axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length
        });

        const counts = {};
        orders.forEach(order => {
          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
          counts[month] = (counts[month] || 0) + 1;
        });

        const sortedMonths = Object.keys(counts).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        setMonthlyData(sortedMonths.map(m => ({ month: m, count: counts[m] })));

      } catch (err) {
        console.error('Dashboard error', err);
      }
    };

    fetchData();
  }, []);

  const cardStyle = "bg-white p-5 rounded-lg shadow flex items-center gap-4";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <UserIcon className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-600">Total Users</p>
            <p className="text-xl font-semibold">{stats.users}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <ShoppingBagIcon className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-600">Total Products</p>
            <p className="text-xl font-semibold">{stats.products}</p>
          </div>
        </div>
        <div className={cardStyle}>
          <ShoppingCartIcon className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-xl font-semibold">{stats.orders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false}/>
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
