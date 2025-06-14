import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setOrders(response.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  function changeOrderStatus(orderId, status) {
    const token = localStorage.getItem("token");
    axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId,
        {
          status: status,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        toast.success("Order status changed successfully");
        setLoaded(false);
      });
  }

  return (
    <div className="w-full h-full">
      {loaded ? (
        <div className="w-full h-full">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer Email</th>
                <th className="p-2">Customer Name</th>
                <th className="p-2">Address</th>
                <th className="p-2">Phone Number</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total Price</th>
                <th className="p-2">Order Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr
                    key={order.orderId}
                    className="border-b-2 border-gray-300 text-center cursor-pointer hover:bg-gray-100"
                  >
                    <td className="p-2">{order.orderId}</td>
                    <td className="p-2">{order.email}</td>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.phoneNumber}</td>
                    <td className="p-2">
                      <select value={order.status} className="z-[50]"
                      
                      onChange={
                        (e) => {
                          changeOrderStatus(order.orderId, e.target.value);
                        }
                      }>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Processing">Processing</option>
                      </select>
                    </td>
                    <td className="p-2">{order.total.toFixed(2)}</td>
                    <td className="p-2">
                      {new Date(order.date).toDateString()}
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-pink-500 text-white p-2 rounded-xl"
                        onClick={() => {
                          setModalIsDisplaying(true);
                          setDisplayingOrder(order);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {modalIsDisplaying && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#00000080]">
              <div className="w-[600px] h-[600px] bg-white max-w-[600px] max-h-[600px] relative">
                <div className="w-full h-[150px] ">
                  <div className="w-full h-[50px] bg-gray-600 flex items-center justify-center text-white text-lg">
                    Order #{displayingOrder.orderId} Details{" "}
                  </div>
                  <div className="row flex p-1 border-b-2 border-gray-300">
                    <div className="w-[400px]">
                      <p> Email: {displayingOrder.email}</p>
                      <p> Name : {displayingOrder.name}</p>
                      <p> Address : {displayingOrder.address}</p>
                      <p> Phone Number : {displayingOrder.phoneNumber}</p>
                    </div>
                    <div className="w-[200px]">
                      <p> Total: {displayingOrder.total.toFixed(2)}</p>
                      <p>
                        {" "}
                        Date: {new Date(displayingOrder.date).toDateString()}
                      </p>
                      <p> Status: {displayingOrder.status}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[450px] max-h-[450px] overflow-y-scroll">
                  {displayingOrder.billItems.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full h-[100px] my-[5px] bg-white shadow-2xl flex justify-between items-center relative"
                      >
                        <img
                          src={item.image}
                          className="h-full aspect-square object-cover"
                        />
                        <div className="h-full max-w-[300px] w-[300px] overflow-hidden">
                          <h1 className="text-xl font-bold">
                            {item.productName}
                          </h1>
                          <h2 className="text-lg text-gray-500">
                            LKR: {item.price.toFixed(2)}
                          </h2>
                          <h2 className="text-lg text-gray-500">
                            Quantity: {item.quantity}
                          </h2>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setModalIsDisplaying(false)}
                  className="w-[40px] h-[40px] rounded-full bg-white shadow shadow-black flex justify-center items-center absolute top-[-20px] right-[-20px]"
                >
                  <IoCloseSharp />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
