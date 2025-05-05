import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show toast if redirected from registration
  // useEffect(() => {
  //   if (location.state?.registered) {
  //     toast.success("Successfully registered");
  //   }
  // }, [location.state]);
  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Successfully registered");
    }
  }, [location.state]);
  

  function handleLogin() {
    setLoading(true);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        console.log("Login Response:", response.data);

        if (response.data.success) {
          toast.success("Login successful");

          localStorage.setItem("token", response.data.token);

          const user = response.data.user;
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } else {
          toast.error(response.data.message || "Login failed");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("Login Failed", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
        setLoading(false);
      });

    console.log("Login button clicked!");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/login-bg.jpg)] bg-cover bg-center">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center m-[5px] cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p className="text-gray-600 text-center m-[10px]">
            Don't have an account?{" "}
            <span className="text-green-500 cursor-pointer hover:text-green-700">
              <Link to="/register">Register Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
