import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', authHeader);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus }, authHeader);
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">User</th>
            <th className="p-2">Items</th>
            <th className="p-2">Total</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-t">
              <td className="p-2 text-sm">{o._id.slice(-6)}</td>
              <td className="p-2">{o.userEmail}</td>
              <td className="p-2 text-sm">{o.items.length}</td>
              <td className="p-2">₹{o.totalPrice}</td>
              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{o.status || 'pending'}</td>
              <td className="p-2">
                <select
                  value={o.status || 'pending'}
                  onChange={e => updateStatus(o._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  {['pending','ready','on the way','delivered','cancelled'].map(s =>
                    <option key={s} value={s}>{s}</option>
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
