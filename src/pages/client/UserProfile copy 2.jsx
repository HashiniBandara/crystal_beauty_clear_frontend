import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserProfile({ Header }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [editProfile, setEditProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [search, setSearch] = useState("");
  const ORDERS_PER_PAGE = 5;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setFormData({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          phone: res.data.user.phone,
        });
      })
      .catch(() => (window.location.href = "/login"));

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => toast.error("Failed to load orders"));
  }, []);

  const totalPages = Math.ceil(
    orders.filter((o) =>
      o.orderId.toLowerCase().includes(search.toLowerCase())
    ).length / ORDERS_PER_PAGE
  );
  const filteredOrders = orders.filter((o) =>
    o.orderId.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handleProfileUpdate = () => {
    const token = localStorage.getItem("token");
    axios
      .put(import.meta.env.VITE_BACKEND_URL + "/api/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Profile updated successfully");
        setEditProfile(false);
        setUser({ ...user, ...formData });
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  const handlePasswordChange = () => {
    const token = localStorage.getItem("token");
    axios
      .put(import.meta.env.VITE_BACKEND_URL + "/api/user/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Password updated");
        setPasswordData({ oldPassword: "", newPassword: "" });
        setShowPasswordModal(false);
      })
      .catch(() => toast.error("Incorrect old password or failed to update"));
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf6f0]">
      {Header && <Header />}
      <div className="max-w-7xl mx-auto px-4 py-10 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order History */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#802549] mb-4 md:mb-0">Order History</h2>
            <input
              type="text"
              placeholder="Search by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded focus:outline-none w-full md:w-60"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 text-center">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {paginatedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow transition"
                >
                  <div>
                    <p className="font-semibold">Order ID: {order.orderId}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()} •{" "}
                      <span className="capitalize text-[#802549]">{order.status}</span>
                    </p>
                  </div>
                  <p className="font-bold text-[#802549] mt-2 sm:mt-0">
                    LKR {order.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-2 sm:mt-0 sm:ml-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded-lg"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border ${
                    page === i + 1
                      ? "bg-pink-600 text-white border-pink-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* User Info */}
        <aside className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#802549]">
            {editProfile ? "Edit Profile" : "User Details"}
          </h2>
          {!editProfile ? (
            <div className="space-y-3 text-[#802549] text-base">
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button
                className="mt-4 text-sm text-pink-600 underline"
                onClick={() => setEditProfile(true)}
              >
                Edit Profile
              </button>
              <button
                className="block text-sm text-pink-600 underline"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border px-3 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border px-3 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border px-3 py-1 rounded"
              />
              <div className="flex space-x-2">
                <button
                  className="bg-pink-600 text-white px-4 py-1 rounded"
                  onClick={handleProfileUpdate}
                >
                  Save
                </button>
                <button
                  className="text-gray-500 underline"
                  onClick={() => setEditProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-2xl text-pink-600"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#802549]">
              Order Details - {selectedOrder.orderId}
            </h3>
            <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <div className="mt-4 border-t pt-4 space-y-2 max-h-64 overflow-y-auto">
              {selectedOrder.billItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} className="w-12 h-12 rounded object-cover border" />
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    LKR {(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-right font-bold text-[#802549]">
              Total: LKR {selectedOrder.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-[#802549]">Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border px-3 py-2 mb-4 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded"
                onClick={handlePasswordChange}
              >
                Save
              </button>
              <button
                className="text-gray-500"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
