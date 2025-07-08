import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { GrGoogle } from "react-icons/gr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registered) {
      toast.success("User registered successfully");
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 100);
    }
  }, [location.state]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
          accessToken: res.access_token,
        })
        .then((response) => {
          if (response.data.success) {
            toast.success("Login successful");
          } else {
            toast.error(response.data.message || "Login failed");
          }
          localStorage.setItem("token", response.data.token);
          const user = response.data.user;
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Login failed");
          setLoading(false);
        });
    },
  });

  function handleLogin() {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Login successful");
        } else {
          toast.error(response.data.message || "Login failed");
        }
        localStorage.setItem("token", response.data.token);
        const user = response.data.user;
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed");
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/login-bg.jpg')" }}>
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl max-w-md w-full p-8 sm:p-10 flex flex-col items-center">
        {/* Logo */}
        <img src="/logo/cbc-logo-withoutbg.png" alt="Logo" className="w-[300px] h-auto mb-6" />

        {/* Email input */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {/* Password input */}
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200 mb-4"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* OR divider */}
        <div className="relative w-full mb-4">
          <hr className="border-gray-300" />
          <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-500">
            OR
          </span>
        </div>

        {/* Google login */}
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-pink-500 text-pink-700 py-3 rounded-lg font-semibold hover:bg-pink-50 transition duration-200 mb-4"
        >
          <GrGoogle className="text-xl" />
          {loading ? "Loading..." : "Login with Google"}
        </button>

        {/* Register link */}
        <p className="text-sm text-gray-700 mb-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-pink-600 hover:underline hover:text-pink-800"
          >
            Register Now
          </Link>
        </p>

        {/* Forgot password */}
        <p className="text-sm text-gray-700">
          Forgot your password?{" "}
          <Link
            to="/forget"
            className="text-pink-600 hover:underline hover:text-pink-800"
          >
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}
