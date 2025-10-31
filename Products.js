import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart!');
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = (product) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    localStorage.setItem(
      "buyNow",
      JSON.stringify({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      })
    );

    navigate("/checkout?mode=buynow");
  };

  const filtered = products.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'lowToHigh') return a.price - b.price;
    if (sortOption === 'highToLow') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen py-12 px-4 md:px-12">
      <h2 className="text-4xl font-bold font-serif text-center text-gray-800 mb-10">Explore Our Mandala Creations</h2>

      <div className="max-w-6xl mx-auto mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 ">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
          >
            <option>All</option>
            <option>Wall Art</option>
            <option>Coaster</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Sort by Price</label>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {sorted.length > 0 ? (
          sorted.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <Link to={`/product/${product._id}`} className="block">
                <img
                  src={product.imageUrl.replace(/\f/g, '')}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />
              </Link>

              <div className="p-5 flex flex-col">
                <Link to={`/product/${product._id}`} className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 hover:underline">{product.name}</h3>
                  <p className="text-gray-500 my-2 font-medium">₹{product.price}</p>
                </Link>

                <div className="space-y-2 mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-1/2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg mt-10">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;
