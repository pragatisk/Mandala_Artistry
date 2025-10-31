import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      console.log("Fetched product:", res.data);
      setProduct(res.data);
    } catch (err) {
      console.error("Error loading product", err);
    }
  };

  const checkAuth = () => {
    const user = localStorage.getItem("token");
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

const addToCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/cart",
      { productId: product._id, quantity: 1 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart!");
  } catch (err) {
    console.error("Failed to add to cart", err);
    toast.error("Error adding to cart");
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


  if (!product)
    return <div className="text-center mt-10 text-gray-500">Loading product details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/products" className="text-blue-700 hover:underline text-sm mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full border rounded-xl overflow-hidden shadow-sm">
          <img
            src={product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`}
            alt={product.name}
            className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

          <span className="inline-block bg-purple-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {product.category}
          </span>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          {product.countInStock > 0 ? (
            <span className="text-green-600 font-semibold mb-4 block">In Stock</span>
          ) : (
            <span className="text-red-500 font-semibold mb-4 block">Out of Stock</span>
          )}

          <p className="text-2xl font-semibold text-green-700 mb-6">₹{product.price}</p>

          <div className="flex flex-wrap gap-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              onClick={addToCart}
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleBuyNow(product)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Customer Reviews</h2>

            <div className="mb-4">
              <p className="font-semibold text-gray-800">Priya Sharma</p>
              <div className="flex items-center text-yellow-500 text-sm mb-1">★★★★☆</div>
              <p className="text-gray-600 text-sm">
                Beautiful artwork! Colors are vibrant and packaging was great.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-gray-800">Rohan Mehta</p>
              <div className="flex items-center text-yellow-500 text-sm mb-1">★★★★★</div>
              <p className="text-gray-600 text-sm">
                Loved the coasters. Perfect gift item. Will order again!
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
