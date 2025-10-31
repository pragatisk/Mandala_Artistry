import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Error loading cart", err);
        toast.error("Unable to load cart");
      }
    };

    fetchCart();
  }, [navigate]);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQty }
            : item
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity", err);
       toast.error("Update failed");
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
      window.dispatchEvent(new Event("cartUpdated"));
       toast.success("Removed from cart");
    } catch (err) {
      console.error("Error removing item", err);
       toast.error("Removal failed");
    }
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(({ product, quantity }) => (
             <li
  key={product._id}
  className="flex justify-between items-center border-b py-4"
>
  <div className="flex items-center gap-4">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-20 h-20 object-cover rounded-md border"
    />
    <div>
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-500">₹{product.price}</p>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => updateQuantity(product._id, quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded"
          disabled={quantity === 1}
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => updateQuantity(product._id, quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
    </div>
  </div>

  <button
    onClick={() => removeItem(product._id)}
    className="text-red-500 hover:text-red-700"
  >
    Remove
  </button>
</li>

            ))}
          </ul>

          <div className="text-right mt-4 font-semibold">
            Total: ₹{getTotal()}
          </div>

          <div className="text-right mt-6">
            <Link to="/checkout">
              <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
