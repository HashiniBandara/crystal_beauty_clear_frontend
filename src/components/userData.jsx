import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserEdit } from "react-icons/fa";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  const linkStyle =
    "flex items-center gap-2 px-4 py-2 hover:bg-pink-50 text-pink-700";

  return (
    <div className="relative">
      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 text-red-700 hover:text-red-800 font-semibold"
            title="Account Menu"
          >
            <FaUserCircle className="text-xl" />
            <span className="hidden md:inline">{user.name || "My Account"}</span>
          </button>

          {/* {openMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-40 z-50">
              <Link to="/profile" className={linkStyle} onClick={() => setOpenMenu(false)}>
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                  setOpenMenu(false);
                  window.location.href = "/login";
                }}
                className={`${linkStyle} w-full text-left`}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )} */}
          {openMenu && (
  <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-44 z-50">
    <Link
      to="/profile"
      className={linkStyle}
      onClick={() => setOpenMenu(false)}
    >
      <FaUserEdit className="text-pink-600" />
      Profile
    </Link>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        setUser(null);
        setOpenMenu(false);
        window.location.href = "/login";
      }}
      className={`${linkStyle} w-full text-left`}
    >
      <FaSignOutAlt className="text-pink-600" />
      Logout
    </button>
  </div>
)}
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link to="/login" className="text-red-700 hover:text-red-800 flex items-center gap-1">
            <FaSignInAlt />
            <span className="hidden md:inline">Login</span>
          </Link>
          <Link to="/register" className="text-red-700 hover:text-red-800 flex items-center gap-1">
            <FaUserPlus />
            <span className="hidden md:inline">Register</span>
          </Link>
        </div>
      )}
    </div>
  );
}
