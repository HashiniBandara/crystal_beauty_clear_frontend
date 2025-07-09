import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile({ Header }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => (window.location.href = "/login"));

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to load orders", err));
  }, []);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  // Pagination helpers
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fdf6f0] flex flex-col">
      {/* Header stays on top */}
      {Header && <Header />}

      {/* Content area: two columns */}
      <div className="flex flex-1 max-w-7xl mx-auto mt-16 gap-8 px-6 py-8">
        {/* Left Sidebar: User Details */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-[#802549]">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">You haven't placed any orders yet.</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex justify-between items-center border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold">Order ID: {order.orderId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} • Status:{" "}
                        <span className="capitalize text-[#802549]">{order.status}</span>
                      </p>
                    </div>
                    <p className="font-bold text-[#802549]">LKR {order.total.toFixed(2)}</p>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="ml-6 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-3">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded border ${
                        page === i + 1
                          ? "bg-pink-600 text-white border-pink-600"
                          : "border-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Right Content: Orders List */}
<aside className="w-80 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-[#802549]">
            User Details
          </h2>
          <div className="space-y-4 text-lg text-[#802549]">
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </aside>

        
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-pink-600 text-2xl font-bold hover:text-pink-800"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-[#802549]">
              Order Details - {selectedOrder.orderId}
            </h3>

            <p className="mb-2">
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span className="capitalize text-[#802549]">{selectedOrder.status}</span>
            </p>
            <p className="mb-2">
              <strong>Shipping Address:</strong> {selectedOrder.address}
            </p>
            <p className="mb-6">
              <strong>Phone:</strong> {selectedOrder.phoneNumber}
            </p>

            <div className="space-y-4 max-h-[400px] overflow-y-auto border-t pt-4">
              {selectedOrder.billItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-right text-xl font-bold text-[#802549]">
              Total: LKR {selectedOrder.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
