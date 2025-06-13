import { useState } from "react";
import // addToCart,
// getTotal,
// getTotalForLabeledPrice,
"../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  // const [cartLoaded, setCartLoaded] = useState(false);
  // const [cart, setCart] = useState([location.state.item]);
  const [cart, setCart] = useState(location.state?.items || []);
  const [cartRefresh, setCartRefresh] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  // useEffect(() => {

  // }, [cartLoaded]);

  function placeOrder() {
    const orderData = {
      name: name,
      address: address,
      phoneNumber: phone,
      billItems: [],
    };
    for (let i = 0; i < cart.length; i++) {
      orderData.billItems[i] = {
        productId: cart[i].productId,
        quantity: cart[i].quantity,
      };
    }
    const token = localStorage.getItem("token");
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/order", orderData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("Order placed successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to place order");
      });
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }
  function getTotalForLabeledPrice() {
    let total = 0;
    cart.forEach((item) => {
      total += item.labeledPrice * item.quantity;
    });
    return total;
  }

  return (
    <div className="w-full h-full flex justify-center p-[40px] relative">
      <div className="w-[700px]">
        {cart.map((item, index) => {
          return (
            <div
              key={index}
              className="w-full h-[100px] my-[5px] bg-white shadow-2xl flex justify-between items-center relative"
            >
              <button
                className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 bg-red-500 w-[30px] h-[30px] text-white text-xl cursor-pointer shadow-2xl rounded-full flex justify-center items-center"
                onClick={() => {
                  //   removeFromCart(item.productId);
                  const newCart = cart.filter(
                    (product) => product.productId !== item.productId
                  );
                  setCart(newCart);
                  // setCartLoaded(false);
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
                    // addToCart(item, -1);
                    const newCart = cart;
                    newCart[index].quantity -= 1;
                    if (newCart[index].quantity <= 0)
                      newCart[index].quantity = 1;
                    setCart(newCart);
                    setCartRefresh(!cartRefresh);
                    // setCartLoaded(false);
                  }}
                >
                  -
                </button>
                <h1 className="text-xl mx-2">{item.quantity}</h1>
                <button
                  className="text-2xl w-[30px] h-[30px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    // addToCart(item.productId);
                    const newCart = cart;
                    newCart[index].quantity += 1;
                    setCart(newCart);
                    setCartRefresh(!cartRefresh);
                    // setCartLoaded(false);
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

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Name</h1>
          <input
            type="text"
            className="w-[200px] text-xl text-end pr-2 border-b-[2px]"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Address</h1>
          <input
            type="text"
            className="w-[200px] text-xl text-end pr-2 border-b-[2px]"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>

        <div className="w-full flex justify-end">
          <h1 className="w-[100px] text-xl text-end pr-2">Phone</h1>
          <input
            type="text"
            className="w-[200px] text-xl text-end pr-2 border-b-[2px]"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </div>

        <div className="w-full flex justify-end mt-4">
          <button
            className="w-[170px] h-[40px] text-white rounded-lg text-xl cursor-pointer bg-pink-400 shadow-2xl"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
