import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaStar, FaUsers } from "react-icons/fa6";
import { MdWarehouse } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa6";
import { FaBoxes, FaUserEdit } from "react-icons/fa";
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrdersPage from "./admin/adminOrders";
import AdminCategoryPage from "./admin/category";
import AddCategoryForm from "./admin/addCategoryForm";
import EditCategoryForm from "./admin/editCategoryForm";
import AdminUsersPage from "./admin/users";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import axios from "axios";
import AdminReviewsPage from "./admin/reviews";
import AdminProfile from "./admin/AdminProfile";

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const user = res.data.user;
        if (user.role === "admin") {
          setUserValidated(true);
          setUserName(user.firstName);
          setUserFirstName(user.firstName);
          setUserLastName(user.lastName);
          setUserImage(user.image || "");
        } else {
          toast.error("You are not an admin");
          navigate("/login");
        }
      })
      .catch(() => {
        toast.error("Please login again");
        navigate("/login");
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  if (!userValidated) return <Loader />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-[#802549] text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-white/20">
          {/* Crystal Beauty Clear */}
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-[#802549]"
          >
            {/* Cristal Beauty Clear */}
            <img
              src="/logo/cbc-logo-new.png"
              alt="Cristal Beauty Clear"
              className="h-12"
            />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <TbLayoutDashboardFilled className="text-xl" />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <FaUsers className="text-lg" />
            Users
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <FaBoxes className="text-lg" />
            Categories
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <MdWarehouse className="text-lg" />
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <FaFileInvoice className="text-lg" />
            Orders
          </Link>
          <Link
            to="/admin/reviews"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
          >
            <FaStar className="text-lg" />
            Reviews
          </Link>
        </nav>
      
        {/* Profile Section at the bottom */}
        <div className="mt-auto px-4 py-5 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={
                userImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Admin"
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div className="flex-1">
              <p className="text-base font-semibold">
                {userFirstName} {userLastName}
              </p>
              <p className="text-xs text-white/70">Administrator</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/60">Online</span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/profile"
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
          >
            <FaUserEdit className="text-base" />
            View Profile
          </Link>
        </div>
      </aside>
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-[#fdf6f0] shadow flex items-center justify-end px-6 border-b border-gray-200">
          <span className="text-gray-600 mr-4">
            Hello, {userName}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
          >
            Logout
          </button>
        </header>
       
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <Routes>
            <Route
              path="/"
              element={<h1 className="text-3xl font-semibold">Dashboard</h1>}
            />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/categories" element={<AdminCategoryPage />} />
            <Route path="/addCategory" element={<AddCategoryForm />} />
            <Route path="/editCategory" element={<EditCategoryForm />} />
            <Route path="/products" element={<AdminProductsPage />} />
            <Route path="/addProduct" element={<AddProductForm />} />
            <Route path="/editProduct" element={<EditProductForm />} />
            <Route path="/orders" element={<AdminOrdersPage />} />
            <Route path="/reviews" element={<AdminReviewsPage />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className=" bg-[#fdf6f0] text-center text-sm text-gray-600 py-3 border-t border-gray-200">
          &copy; {new Date().getFullYear()} Crystal Beauty Clear. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
