import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaKey,
  FaUserAlt,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";
import mediaUpload from "../../utils/mediaUpload"; 

export default function UserProfile({ Header }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [editProfile, setEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [search, setSearch] = useState("");
  const ORDERS_PER_PAGE = 5;

  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    image: "", 
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null); 

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
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          phone: u.phone || "",
          email: u.email || "",
          image: u.image || "", 
        });
        setImagePreview(u.image || null); 
      })
      .catch(() => (window.location.href = "/login"));

    // Fetch orders
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setOrders(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      )
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

 
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      let imageUrl = formData.image;

      
      if (imageFile) {
        toast.loading("Uploading image...");
        imageUrl = await mediaUpload(imageFile);
        toast.dismiss();
        toast.success("Image uploaded");
      }

      
      const updatedData = {
        ...formData,
        image: imageUrl,
      };

      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/user/update",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setUser(res.data.user);
      setFormData((prev) => ({ ...prev, image: res.data.user.image || "" }));
      setEditProfile(false);
      setImageFile(null);
      setImagePreview(res.data.user.image || null);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update profile");
    }
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
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      })
      .catch(() => toast.error("Incorrect old password or failed to update"));
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#802549] font-sans">
      {Header && <Header />}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order History */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold flex items-center gap-2">
              <MdManageHistory className="text-4xl" />
              Order History
            </h2>
            <input
              type="text"
              placeholder="Search by Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-600 transition w-full md:w-64"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 text-center mt-12 text-lg font-medium">
              No orders found.
            </p>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[480px] pr-2">
              {paginatedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:bg-[#fdf6f0] transition"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      Order ID:{" "}
                      <span className="text-pink-700">{order.orderId}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.date).toLocaleDateString()}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <p className="font-bold text-pink-700 text-lg mt-4 sm:mt-0">
                    LKR {order.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-4 sm:mt-0 sm:ml-6 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow transition"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-full border ${
                    page === i + 1
                      ? "bg-pink-700 text-white border-pink-700"
                      : "border-gray-300 hover:bg-pink-100"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Profile Section */}
        <aside className="bg-white rounded-2xl shadow-lg p-8 h-fit">
          <div className="flex justify-center mb-4 flex-col items-center">
            <img
              src={
                imagePreview ||
                formData.image || 
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border object-cover shadow-md mb-2"
            />
            
            {editProfile && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="text-sm text-pink-700"
              />
            )}
          </div>

          <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2 text-center justify-center">
            {editProfile ? (
              <FaUserEdit className="text-4xl" />
            ) : showChangePassword ? (
              <FaKey className="text-4xl" />
            ) : (
              <FaUserCircle className="text-4xl" />
            )}
            {editProfile
              ? "Edit Profile"
              : showChangePassword
              ? "Change Password"
              : "My Profile"}
          </h2>

          {/* Profile Info */}
          {!editProfile && !showChangePassword && (
            <div className="space-y-4 text-center">
              <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => setEditProfile(true)}
                  className="bg-pink-700 hover:bg-pink-800 text-white font-semibold py-2 px-4 rounded-lg shadow"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded-lg shadow"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Edit Profile Form */}
          {editProfile && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={formData.firstName}
                placeholder="First Name"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              />
              <input
                type="text"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              />
              <input
                type="tel"
                value={formData.phone}
                placeholder="Phone"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-pink-700 text-white px-6 py-2 rounded-lg hover:bg-pink-800 font-semibold shadow"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded-lg shadow"
                  onClick={() => {
                    setEditProfile(false);
                    setImageFile(null);
                    setImagePreview(user.image || null);
                    setFormData((prev) => ({
                      ...prev,
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      phone: user.phone || "",
                      image: user.image || "",
                    }));
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Change Password Form */}
          {showChangePassword && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange();
              }}
              className="space-y-4 mt-6"
            >
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-pink-700 text-white px-6 py-2 rounded-lg hover:bg-pink-800 font-semibold shadow"
                >
                  Change
                </button>
                <button
                  type="button"
                  className="bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded-lg shadow"
                  onClick={() => setShowChangePassword(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>

      {/* Order Modal */}
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
              className="absolute top-5 right-6 text-3xl font-bold text-pink-700 hover:text-pink-900"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-pink-700">
              Order Details - {selectedOrder.orderId}
            </h3>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize font-semibold ${
                  selectedOrder.status === "Delivered"
                    ? "text-green-600"
                    : "text-pink-600"
                }`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <div className="space-y-4 border-t pt-4 max-h-64 overflow-y-auto mt-4">
              {selectedOrder.billItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
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
    </div>
  );
}
