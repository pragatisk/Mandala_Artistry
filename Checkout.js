import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Checkout() {
  const [items, setItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [contact, setContact] = useState("+91");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shipping, setShipping] = useState({
    address: "", city: "", state: "", postalCode: "", country: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isBuyNow = new URLSearchParams(location.search).get("mode") === "buynow";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    (async () => {
      if (isBuyNow) {
        const buyNowItem = JSON.parse(localStorage.getItem("buyNow"));
        if (!buyNowItem) {
          toast.error("No 'Buy Now' item found");
          return navigate("/products");
        }
        setItems([{ product: buyNowItem, quantity: buyNowItem.quantity || 1 }]);
      } else {
        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setItems(res.data);
        } catch {
          toast.error("Failed fetching cart");
          navigate("/cart");
        }
      }
    })();
  }, [navigate, isBuyNow]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return toast.error("Login required");

    if (!/^\+91\d{10}$/.test(contact)) return toast.error("Enter valid 10-digit phone with +91");
    if (!/^\d{6}$/.test(shipping.postalCode)) return toast.error("Invalid postal code");

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            imageUrl: item.product.imageUrl,
          })),
          shippingAddress: shipping,
          contact,
          paymentMethod,
          totalPrice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("buyNow");
      setItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      setShowDialog(true);
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <ul className="mb-6">
        {items.map(({ product, quantity }) => (
          <li key={product._id} className="flex justify-between py-2 border-b">
            <p>{product.name} × {quantity}</p>
            <p>₹{product.price * quantity}</p>
          </li>
        ))}
      </ul>

      <div className="text-right text-lg font-semibold mb-6">Total: ₹{total}</div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Country</label>
          <select
            value={shipping.country}
            onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
            required
            className="w-full px-3 py-2 border-2 rounded"
          >
            <option value="">Select</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">State</label>
          <select
            value={shipping.state}
            onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
            required
            className="w-full px-3 py-2 border-2 rounded"
          >
            <option value="">Select</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            required
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            className="w-full px-3 py-2 border-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            required
            value={shipping.address}
            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            className="w-full px-3 py-2 border-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Postal Code</label>
          <input
            type="text"
            required
            value={shipping.postalCode}
            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
            className="w-full px-3 py-2 border-2 rounded"
            placeholder="6-digit code"
          />
        </div>

        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3 py-2 border-2 rounded"
            placeholder="+91 XXXXXXXXXX"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border-2 rounded"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div className="sm:col-span-2 text-right mt-4">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Place Order
          </button>
        </div>
      </form>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
            <p className="mb-6">Thank you for your purchase.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
