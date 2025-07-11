import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.items || []);
  const [cartRefresh, setCartRefresh] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  function placeOrder() {
    const orderData = {
      name,
      address,
      phoneNumber: phone,
      billItems: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    const token = localStorage.getItem("token");

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Order placed successfully");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to place order");
      });
  }

  const getTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalForLabeledPrice = () =>
    cart.reduce((total, item) => total + item.labeledPrice * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] text-[#802549] font-semibold text-xl">
        No items to checkout.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6f0] px-4 py-10 lg:px-20 text-[#802549] font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {cart.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md flex flex-col lg:flex-row items-center p-4 relative"
          >
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => {
                const updated = cart.filter((p) => p.productId !== item.productId);
                setCart(updated);
              }}
            >
              <TbTrash className="text-2xl" />
            </button>

            <img
              src={item.images}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-lg mr-0 lg:mr-6 mb-4 lg:mb-0"
            />

            <div className="flex-1 w-full">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{item.altName.join(" | ")}</p>
              <p className="text-sm text-gray-700">LKR {item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center mt-4 lg:mt-0 space-x-3">
              <button
                className="w-8 h-8 text-xl bg-gray-200 hover:bg-gray-300 rounded-full"
                onClick={() => {
                  const updated = [...cart];
                  updated[index].quantity = Math.max(1, updated[index].quantity - 1);
                  setCart(updated);
                  setCartRefresh(!cartRefresh);
                }}
              >
                −
              </button>
              <span className="text-lg font-medium">{item.quantity}</span>
              <button
                className="w-8 h-8 text-xl bg-gray-200 hover:bg-gray-300 rounded-full"
                onClick={() => {
                  const updated = [...cart];
                  updated[index].quantity += 1;
                  setCart(updated);
                  setCartRefresh(!cartRefresh);
                }}
              >
                +
              </button>
            </div>

            <div className="text-right text-lg font-semibold w-full lg:w-[100px] mt-2 lg:mt-0">
              LKR {(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 text-right text-lg font-medium">
          <div className="flex justify-between">
            <span>Total:</span>
            <span>LKR {getTotalForLabeledPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-green-600">
              − LKR {(getTotalForLabeledPrice() - getTotal()).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-xl font-bold">
            <span>Net Total:</span>
            <span className="text-[#802549]">LKR {getTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Delivery Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Place Order Button */}
        <div className="text-right">
          <button
            onClick={placeOrder}
            className="bg-pink-800 hover:bg-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
