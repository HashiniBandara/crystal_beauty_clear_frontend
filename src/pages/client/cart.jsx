import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getCart, {
  addToCart,
  getTotal,
  getTotalForLabeledPrice,
  removeFromCart,
} from "../../utils/cart";
import { TbTrash } from "react-icons/tb";

export default function CartPage() {
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartLoaded) {
      setCart(getCart());
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] text-[#802549] font-semibold text-xl">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6f0] px-4 py-10 lg:px-20 text-[#802549] font-sans mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {cart.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md flex flex-col lg:flex-row items-center p-4 relative"
          >
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => {
                removeFromCart(item.productId);
                setCartLoaded(false);
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
                  addToCart(item, -1);
                  setCartLoaded(false);
                }}
              >
                −
              </button>
              <span className="text-lg font-medium">{item.quantity}</span>
              <button
                className="w-8 h-8 text-xl bg-gray-200 hover:bg-gray-300 rounded-full"
                onClick={() => {
                  addToCart(item, 1);
                  setCartLoaded(false);
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

        {/* Checkout Button */}
        <div className="text-right">
          <button
            onClick={() => navigate("/checkout", { state: { items: cart } })}
            className="bg-pink-800 hover:bg-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
