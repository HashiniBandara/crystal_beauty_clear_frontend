import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
  const [displayingOrder, setDisplayingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setOrders(res.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  function changeOrderStatus(orderId, status) {
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId,
        { status },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        toast.success("Order status updated");
        setLoaded(false);
      });
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  const filteredOrders = orders
    .filter((order) =>
      `${order.name} ${order.email} ${order.orderId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    // .filter((order) => {
    //   if (statusFilter && order.status !== statusFilter) return false;
    //   return true;
    // });

    .filter((order) => {
  if (statusFilter && order.status.trim().toLowerCase() !== statusFilter.toLowerCase()) return false;
  return true;
});


  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortBy) return 0;
    let aVal = sortBy === "date" ? new Date(a.date) : a[sortBy];
    let bVal = sortBy === "date" ? new Date(b.date) : b[sortBy];
    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Orders</h1>
        <span className="text-sm text-gray-600">Total: {orders.length}</span>
      </div>

      {/* Search, Filters, Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by order ID, name, email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          />
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="status">Status</option>
          <option value="date">Order Date</option>
        </select>

        {sortBy && (
          <div className="text-gray-500">
            {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
          </div>
        )}
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded shadow border">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#802549] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b hover:bg-[#fdf6f0] text-center">
                    <td className="p-2">{order.orderId}</td>
                    <td className="p-2">{order.email}</td>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.phoneNumber}</td>
                    <td className="p-2">
                      <select
                        className="px-2 py-1 rounded border text-sm"
                        value={order.status}
                        onChange={(e) =>
                          changeOrderStatus(order.orderId, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-2">LKR {order.total.toFixed(2)}</td>
                    <td className="p-2">{new Date(order.date).toDateString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setDisplayingOrder(order);
                          setModalIsDisplaying(true);
                        }}
                        className="px-3 py-1 text-sm bg-[#802549] text-white rounded hover:bg-pink-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <Loader />
      )}

      {/* Modal */}
      {modalIsDisplaying && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#00000080] z-20">
              <div className="w-[600px] h-[600px] bg-white max-w-[600px] max-h-[600px] relative">
                <div className="w-full h-[150px] ">
                  <div className="w-full h-[50px] bg-[#802549] flex items-center justify-center text-white text-lg">
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
                        className="w-full h-[100px] my-[5px] bg-[#fdf6f0] shadow-2xl flex justify-between items-center relative"
                      >
                        <img
                          src={item.image}
                          className="h-full aspect-square object-cover"
                        />
                        <div className="h-full max-w-[400px] w-[400px] overflow-hidden">
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
                  className="w-[40px] h-[40px] rounded-full bg-[#fdf6f0] shadow shadow-black flex justify-center items-center absolute top-[-20px] right-[-20px]"
                >
                  <IoCloseSharp />
                </button>
              </div>
            </div>
          )}
    </div>
  );
}
