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
    email: "", // Required to avoid 400 error on update
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setFormData({
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          email: u.email,
        });
      })
      .catch(() => (window.location.href = "/login"));

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"));
  }, []);

  const filteredOrders = orders.filter((o) =>
    o.orderId.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
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
      .then((res) => {
        toast.success(res.data.message);
        setUser(res.data.user);
        setEditProfile(false);
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/user/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Password updated");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordModal(false);
      })
      .catch(() => toast.error("Incorrect old password or failed to update"));
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#802549] font-sans">
      {Header && <Header />}
      <div className="max-w-7xl mx-auto px-4 py-10 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order History */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Order History</h2>
            <input
              type="text"
              placeholder="Search by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-[#802549] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 w-full md:w-64 transition"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 text-center mt-12 text-lg font-medium">No orders found.</p>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[480px] pr-2">
              {paginatedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg transition duration-300"
                >
                  <div>
                    <p className="font-semibold text-lg">Order ID: <span className="text-pink-700">{order.orderId}</span></p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.date).toLocaleDateString()} •{" "}
                      <span className={`capitalize font-semibold ${order.status === "completed" ? "text-green-600" : "text-pink-600"}`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <p className="font-bold text-pink-700 text-lg mt-4 sm:mt-0">LKR {order.total.toFixed(2)}</p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-4 sm:mt-0 sm:ml-6 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                    aria-label={`View details for order ${order.orderId}`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-3 select-none">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-full border transition ${
                    page === i + 1
                      ? "bg-pink-700 text-white border-pink-700"
                      : "border-gray-300 text-gray-700 hover:bg-pink-100"
                  }`}
                  onClick={() => setPage(i + 1)}
                  aria-label={`Go to page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* User Info / Edit */}
        <aside className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-3xl font-extrabold mb-6 border-b border-pink-600 pb-3">
            {editProfile ? "Edit Profile" : "User Details"}
          </h2>
          {!editProfile ? (
            <div className="space-y-5 text-lg font-medium leading-relaxed">
              <p>
                <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                <span className="capitalize bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
              </p>

              <div className="flex flex-col space-y-3 mt-8">
                <button
                  onClick={() => setEditProfile(true)}
                  className="text-pink-700 underline font-semibold text-lg hover:text-pink-900 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-pink-700 underline font-semibold text-lg hover:text-pink-900 transition"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
                pattern="^[0-9+\-\s()]*$"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition shadow"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="text-gray-500 underline hover:text-gray-700"
                  onClick={() => setEditProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-6 text-3xl font-bold text-pink-700 hover:text-pink-900 transition"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close order details"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-pink-700">
              Order Details - {selectedOrder.orderId}
            </h3>
            <p className="mb-2">
              <strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p className="mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize font-semibold ${
                  selectedOrder.status === "completed" ? "text-green-600" : "text-pink-600"
                }`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <div className="space-y-4 border-t border-gray-200 pt-4 max-h-64 overflow-y-auto">
              {selectedOrder.billItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    LKR {(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-right font-bold text-pink-700 text-xl">
              Total: LKR {selectedOrder.total.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-6 text-3xl font-bold text-pink-700 hover:text-pink-900 transition"
              onClick={() => setShowPasswordModal(false)}
              aria-label="Close password change modal"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-pink-700">
              Change Password
            </h3>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
              required
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition shadow"
                onClick={handlePasswordChange}
              >
                Save
              </button>
              <button
                className="text-gray-500 underline hover:text-gray-700"
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
