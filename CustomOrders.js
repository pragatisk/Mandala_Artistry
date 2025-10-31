import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomOrderPage() {
  const [idea, setIdea] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    size: '12x12',
    type: 'Traditional',
    colors: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!idea) return alert('Enter a theme to get ideas.');
    setLoading(true);
    setTimeout(() => {
      setGenerated(`Mandala idea for theme: "${idea}" — include floral and geometric patterns in pastel tones.`);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const { size, type, colors, description } = form;
    if (!colors || !description || !type) {
      return alert('Please fill out all fields.');
    }

    try {
      await axios.post(
        'http://localhost:5000/api/orders/custom',
        { size, type, colors, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Custom order submitted! We will reach out soon.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Submission failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-serif font-bold text-center mb-4 text-gray-800">Create Your Custom Mandala</h1>
      <p className="text-center text-gray-500 mb-10">Share your vision with us — or get inspired.</p>

      {/* Inspiration Section */}
      <div className="bg-gray-50 border border-dashed border-orange-300 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-2 text-orange-600">Need Inspiration?</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., peace, floral, cosmic"
            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            {loading ? 'Generating...' : 'Generate Idea'}
          </button>
        </div>
        {generated && (
          <p className="mt-4 text-sm text-gray-700 italic bg-white border p-3 rounded shadow">{generated}</p>
        )}
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium block mb-1 text-gray-700">Size</label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full p-3 border rounded-md"
            >
              <option>12x12</option>
              <option>18x18</option>
              <option>24x24</option>
              <option>36x36</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="font-medium block mb-1 text-gray-700">Mandala Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            >
              <option>Traditional</option>
              <option>Modern</option>
              <option>Spiritual</option>
              <option>Minimalist</option>
              <option>Abstract</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1 text-gray-700">Preferred Colors</label>
          <input
            type="text"
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
            placeholder="e.g., shades of blue, silver accents"
            className="w-full p-3 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1 text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            placeholder="Describe the symbolism, style, mood, or any specific elements you envision..."
            className="w-full p-3 border rounded-md"
            required
          />
        </div>

        <p className="text-sm text-gray-500">* Our artist will contact you for final pricing based on your request.</p>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold text-lg"
        >
          Submit Custom Request
        </button>
      </form>
    </div>
  );
}
