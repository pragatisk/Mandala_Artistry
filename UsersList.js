import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >Delete</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan="4" className="p-4 text-center text-gray-500">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
