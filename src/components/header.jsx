import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import UserData from "./userData";
import getCart from "../utils/cart";
import {
  FaUserEdit,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import axios from "axios";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  const updateCartCount = () => {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, [token]);

  const linkStyle = "hover:text-pink-700 transition";

  return (
    <header className="w-full bg-white shadow fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-[#802549]"
        >
          <img
            src="/logo/cbc-logo-new.png"
            alt="Cristal Beauty Clear"
            className="h-12"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-[#802549] text-base font-medium relative">
          <Link to="/" className={linkStyle}>
            Home
          </Link>
          <Link to="/products" className={linkStyle}>
            Products
          </Link>

          {/* Category Dropdown */}
          <div className="relative group">
            <button className={linkStyle}>Categories</button>
            <div className="absolute top-full left-0 mt-3 w-32 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition duration-200 origin-top">
              <Link
                to="/category/skincare"
                className="block px-4 py-2 hover:bg-pink-50"
              >
                Skincare
              </Link>
              <Link
                to="/category/makeup"
                className="block px-4 py-2 hover:bg-pink-50"
              >
                Makeup
              </Link>
              <Link
                to="/category/haircare"
                className="block px-4 py-2 hover:bg-pink-50"
              >
                Haircare
              </Link>
            </div>
          </div>

          <Link to="/contact" className={linkStyle}>
            Contact Us
          </Link>
          <Link to="/about" className={linkStyle}>
            About 
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-5 relative">
          <div className="hidden lg:block">
            <UserData />
          </div>

          <Link
            to="/cart"
            className="text-2xl text-[#802549] hover:text-pink-700 transition relative"
          >
            <BsCart4 />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden text-3xl text-[#802549]"
            onClick={() => setIsOpen(true)}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-white p-6 space-y-6 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xl font-bold text-[#802549]">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-pink-600"
              >
                &times;
              </button>
            </div>
            <nav className="flex flex-col space-y-4 text-[#802549] font-medium">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
              >
                Products
              </Link>

              {/* Expandable Categories */}
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="text-left hover:text-pink-700 transition"
              >
                Categories {isCategoryOpen ? "▾" : "▸"}
              </button>
              {isCategoryOpen && (
                <div className="ml-4 space-y-2">
                  <Link
  to="/category/skincare"
  onClick={() => setIsOpen(false)}
  className="block hover:text-pink-700 transition"
>
  Skincare
</Link>
<Link
  to="/category/makeup"
  onClick={() => setIsOpen(false)}
  className="block hover:text-pink-700 transition"
>
  Makeup
</Link>
<Link
  to="/category/haircare"
  onClick={() => setIsOpen(false)}
  className="block hover:text-pink-700 transition"
>
  Haircare
</Link>

                </div>
              )}

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={linkStyle}
              >
                About
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 hover:text-pink-700 transition"
              >
                <span>Cart</span>
              </Link>

              {/* User Section (Mobile Only) */}
              <div className="pt-6 border-t">
                {user ? (
                  <>
                    <Link
                      to={user?.role === "admin" ? "/admin" : "/profile"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-pink-700 hover:text-pink-800 px-2 py-2"
                    >
                      <FaUserEdit />
                      {user?.role === "admin" ? "Admin Panel" : "My Account"}
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        setUser(null);
                        setIsOpen(false);
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-2 text-pink-700 hover:text-pink-800 px-2 py-2 w-full text-left"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-pink-700 hover:text-pink-800 px-2 py-2"
                    >
                      <FaSignInAlt />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-pink-700 hover:text-pink-800 px-2 py-2"
                    >
                      <FaUserPlus />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* Overlay */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
