import { useEffect, useState } from "react";
import getCart, {
  addToCart,
  getTotal,
  getTotalForLabeledPrice,
  removeFromCart,
} from "../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartLoaded) {
      const newCart = getCart();
      setCart(newCart);
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  return (
    <div className="w-full h-full flex justify-center p-[40px] relative">
      <div className="w-[700px]">
        {cart.map((item, index) => {
          return (
            <div
              key={index}
              className="w-full h-[100px] my-[5px] bg-white shadow-2xl flex justify-between items-center relative"
            >
              {/* Trash button here, inside the loop */}
              {/* <button
                className="absolute right-[10px] top-[10px] bg-red-500 w-[30px] h-[30px] text-white cursor-pointer rounded-full flex justify-center items-center"
                onClick={() => {
                  removeFromCart(item.productId);
                  setCartLoaded(false);
                }}
              >
                <TbTrash />
              </button> */}

              <button
                className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 bg-red-500 w-[30px] h-[30px] text-white text-xl cursor-pointer shadow-2xl rounded-full flex justify-center items-center"
                onClick={() => {
                  removeFromCart(item.productId);
                  setCartLoaded(false);
                }}
              >
                <TbTrash />
              </button>

              <img
                src={item.images}
                className="h-full aspect-square object-cover"
              />

              <div className="h-full max-w-[300px] w-[300px] overflow-hidden">
                <h1 className="text-xl font-bold">{item.name}</h1>
                <h2 className="text-lg text-gray-500 ">
                  {item.altName.join(" | ")}
                </h2>
                <h2 className="text-lg text-gray-500 ">
                  LKR: {item.price.toFixed(2)}
                </h2>
              </div>

              <div className="h-full w-[100px] flex justify-center items-center">
                <button
                  className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    addToCart(item, -1);
                    setCartLoaded(false);
                  }}
                >
                  -
                </button>
                <h1 className="text-xl mx-2">{item.quantity}</h1>
                <button
                  className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    addToCart(item, 1);
                    setCartLoaded(false);
                  }}
                >
                  +
                </button>
              </div>

              <div className="h-full w-[100px] flex justify-center items-center">
                <h1 className="text-xl w-full text-end pr-2">
                  {(item.quantity * item.price).toFixed(2)}
                </h1>
              </div>
            </div>
          );
        })}

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Total</h1>
          <h1 className="w-[100px] text-xl text-end pr-2">
            {getTotalForLabeledPrice().toFixed(2)}
          </h1>
        </div>

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Discount</h1>
          <h1 className="w-[100px] text-xl text-end pr-2 border-b-[2px]">
            {(getTotalForLabeledPrice() - getTotal()).toFixed(2)}
          </h1>
        </div>

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Net Total</h1>
          <h1 className="w-[100px] text-xl text-end pr-2 border-double border-b-[4px]">
            {getTotal().toFixed(2)}
          </h1>
        </div>

        <div className="w-full flex justify-end mt-4">
          <button
            className="w-[170px] h-[40px] text-white rounded-lg text-xl cursor-pointer bg-pink-400 shadow-2xl"
            onClick={() => {
              navigate("/checkout", { state: { items: cart } });
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
