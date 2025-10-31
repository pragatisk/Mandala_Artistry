import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { toast, ToastContainer } from 'react-toastify';


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', category: '', countInStock: '', imageUrl: '', description: '', isFeatured: false
  });
  const dialogRef = useRef(null);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => {
    dialogRef.current?.close();
    setEditing(null);
    setForm({ name: '', price: '', category: '', countInStock: '', imageUrl: '', description: '', isFeatured: false });
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () =>
    axios.get('http://localhost:5000/api/products', authHeader)
      .then(res => setProducts(res.data))
      .catch(console.error);

  const handleSave = async () => {
    try {
      const data = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        countInStock: Number(form.countInStock),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        isFeatured: Boolean(form.isFeatured),
      };

      if (!data.name || !data.price || !data.category || !data.imageUrl || !data.description) {
        toast.error('Please fill in all required fields.');
        return;
      }

      if (editing) {
        await axios.put(`http://localhost:5000/api/products/${editing}`, data, authHeader);
      } else {
        await axios.post('http://localhost:5000/api/products', data, authHeader);
      }

      closeModal();
      refresh();
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error saving product.');
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      countInStock: p.countInStock,
      imageUrl: p.imageUrl,
      description: p.description,
      isFeatured: p.isFeatured || false
    });
    openModal();
  };

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  });
 
  if (result.isConfirmed) {
    try {
await axios.delete(`http://localhost:5000/api/products/${id}`, authHeader);
      toast.success("Product deleted successfully");
      refresh();
    } catch (err) {
      toast.error("Failed to delete product");
      console.error("Delete error:", err);
    }
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => { closeModal(); openModal(); }}
      >
        + Add Product
      </button>

      <dialog ref={dialogRef} className="rounded-lg p-0 w-full max-w-lg">
        <form method="dialog" className="bg-white p-6 flex flex-col gap-4">
  <h3 className="text-xl font-semibold">{editing ? 'Edit' : 'Add'} Product</h3>

  <input
    placeholder="Name"
    value={form.name}
    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
    className="border px-3 py-2 rounded"
  />

  <input
    placeholder="Price"
    value={form.price}
    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
    className="border px-3 py-2 rounded"
  />

  {/* 🆕 Category Dropdown */}
  <select
    value={form.category}
    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
    className="border px-3 py-2 rounded"
  >
    <option value="">Select Category</option>
    <option value="Wall Art">Wall Art</option>
    <option value="Coaster">Coaster</option>
    <option value="Custom">Custom</option>
  </select>

  <input
    placeholder="Count in Stock"
    value={form.countInStock}
    onChange={e => setForm(prev => ({ ...prev, countInStock: e.target.value }))}
    className="border px-3 py-2 rounded"
  />

  <input
    placeholder="Image URL"
    value={form.imageUrl}
    onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
    className="border px-3 py-2 rounded"
  />

  <textarea
    placeholder="Description"
    value={form.description}
    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
    className="border px-3 py-2 rounded resize-none"
    rows={3}
  />

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={form.isFeatured}
      onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
    />
    Featured Product
  </label>

  <div className="flex justify-end gap-2 mt-4">
    <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>
      Cancel
    </button>
    <button type="button" className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>
      {editing ? 'Update' : 'Add'}
    </button>
  </div>
</form>

      </dialog>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            {['Name', 'Price', 'Category', 'Stock', 'Featured', 'Actions'].map(h => (
              <th key={h} className="p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">₹{p.price}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.countInStock}</td>
              <td className="p-2">{p.isFeatured ? '✅' : '—'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
