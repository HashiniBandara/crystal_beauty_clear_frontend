import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneHome } from "react-icons/ai";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister() {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/",
        { firstName, lastName, email, phone, password }
      );

      if (response.data.success) {
        navigate("/login", { state: { registered: true } });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl max-w-md w-full p-8 sm:p-10 flex flex-col items-center">
        {/* Logo */}
        <img src="/logo/cbc-logo-withoutbg.png" alt="Logo" className="w-[300px] h-auto mb-6" />

        {/* Input fields */}
        <input
          onChange={handleChange}
          name="firstName"
          value={formData.firstName}
          type="text"
          placeholder="First Name"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          onChange={handleChange}
          name="lastName"
          value={formData.lastName}
          type="text"
          placeholder="Last Name"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          onChange={handleChange}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          onChange={handleChange}
          name="phone"
          value={formData.phone}
          type="text"
          placeholder="Phone Number"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          onChange={handleChange}
          name="password"
          value={formData.password}
          type="password"
          placeholder="Password"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          onChange={handleChange}
          name="confirmPassword"
          value={formData.confirmPassword}
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200 mb-1"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Already have an account */}
        <p className="text-sm text-gray-700 mb-1">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 hover:underline hover:text-pink-800"
          >
            Login
          </Link>
        </p>
         {/* Back to Home Icon */}
                <p className="text-sm text-gray-700 flex items-center">
                  Back to home{" "}
                  <Link
                    to="/"
                    className="text-pink-600 hover:underline hover:text-pink-800 text-lg mx-2"
                  >
                    <AiTwotoneHome />
                  </Link>
                </p>
      </div>
    </div>
  );
}
