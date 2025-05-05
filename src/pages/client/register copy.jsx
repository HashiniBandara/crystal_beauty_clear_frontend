import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/",
        {
          firstName,
          lastName,
          email,
          phone,
          password,
        }
      );

    //   if (response.data.success) {
    //     toast.success("Registration successful");
    //     navigate("/login");
    //   } 
    if (response.data.success) {
        toast.success("Registration successful");
        setTimeout(() => navigate("/login"), 1500); // 👈 Delay navigation
      }
      else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/login-bg.jpg)] bg-cover bg-center">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[700px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
          <input
            onChange={handleChange}
            name="firstName"
            value={formData.firstName}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="text"
            placeholder="First Name"
          />
          <input
            onChange={handleChange}
            name="lastName"
            value={formData.lastName}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="text"
            placeholder="Last Name"
          />
          <input
            onChange={handleChange}
            name="email"
            value={formData.email}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="email"
            placeholder="Email"
          />
          <input
            onChange={handleChange}
            name="phone"
            value={formData.phone}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="text"
            placeholder="Phone Number"
          />
          <input
            onChange={handleChange}
            name="password"
            value={formData.password}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Password"
          />
          <input
            onChange={handleChange}
            name="confirmPassword"
            value={formData.confirmPassword}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Confirm Password"
          />
          <button
            onClick={handleRegister}
            className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center m-[5px] cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-gray-600 text-center m-[10px]">
            Already have an account?{" "}
            <span className="text-green-500 cursor-pointer hover:text-green-700">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
