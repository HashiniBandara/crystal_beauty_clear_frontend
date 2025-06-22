import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserData() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token != null) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((e) => {
          console.log(e);
          setUser(null);
        });
    }
  }, []);
  return (
    <>
      {user == null ? (
        <div className="h-full flex justify-center item-center flex-row">
          <Link
            to="/login"
            className="text-white text-2xl bg-blue-600 px-5 py-3 rounded-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white text-2xl bg-blue-600 px-5 py-3 rounded-md"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="h-full flex justify-center item-center flex-row">
          <Link
            to="/profile"
            className="text-white text-2xl bg-blue-600 px-5 py-3 rounded-md"
          >
            Profile
          </Link>
          {/* <Link to="/logout" className="text-white text-2xl bg-blue-600 px-5 py-3 rounded-md">Logout</Link> */}
          <button
            className="text-white text-2xl bg-blue-600 px-5 py-3 rounded-md"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
