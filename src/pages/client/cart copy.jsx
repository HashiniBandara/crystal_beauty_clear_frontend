import { TbTrash } from "react-icons/tb";
import getCart, { addToCart, removeFromCart } from "../../utils/cart";
import { useEffect, useState } from "react";

export default function CartPage() {
  //   const cart = getCart();
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartLoaded == false) {
      const cart = getCart();
      setCart(cart);
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  return (
    <div className="w-full h-full flex justify-center p-[40px] relative">
      <button
        className="absolute right-[50px] bg-red-500 w-[40px] h-[40px] text-white cursor-pointer rounded-full flex justify-center items-center"
        onClick={() => {
          removeFromCart(item.productId);
          setCartLoaded(false);
        }}
      >
        <TbTrash />
      </button>
      <div className="w-[700px]">
        {cart.map((item, index) => {
          return (
            <div
              key={index}
              className="w-full h-[100px] my-[5px] bg-white shadow-2xl flex justify-between items-center"
            >
              <img
                src={item.images}
                className="h-full aspect-square object-cover"
              />

              <div className="h-full max-w-[300px] w-[300px] overflow-hidden">
                <h1 className="text-xl font-bold">{item.name}</h1>
                <h2 className="text-lg text-gray-500 ">
                  {item.altName.join("| ")}
                </h2>
                <h2 className="text-lg text-gray-500 ">
                  {" "}
                  LKR: {item.price.toFixed(2)}
                </h2>
              </div>
              <div className="h-full w-[100px] flex justify-center items-center">
                <button
                  className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex justify-center item-center cursor-pointer"
                  onClick={() => {
                    addToCart(item, -1);
                    setCartLoaded(false);
                  }}
                >
                  -
                </button>
                <h1 className="text-xl">{item.quantity}</h1>
                <button
                  className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex justify-center item-center cursor-pointer"
                  onClick={() => {
                    addToCart(item, 1);
                    setCartLoaded(false);
                  }}
                >
                  +
                </button>
              </div>
              <div className="h-full w-[100px] flex justify-center items-center">
                <h1 className="text-xl">
                  {(item.quantity * item.price).toFixed(2)}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
