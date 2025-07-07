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

//  useEffect(() => {
//     if (location.state?.registered) {
//       toast.success("User registered successfully");
//     }
//   }, [location.state]);
useEffect(() => {
  if (location.state?.registered) {
    toast.success("User registered successfully");
    setTimeout(() => {
      navigate(location.pathname, { replace: true }); // remove state
    }, 100); // optional delay
  }
}, [location.state]);


  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      //console.log(res);
      setLoading(true);
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
          accessToken: res.access_token,
        })
        .then((response) => {
          console.log("Login Response:", response.data);
          if (response.data.success) {
            // Ensure success before showing toast
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
        }).catch((error) => {
          console.log("Login Failed", error.response?.data);
          toast.error(error.response?.data?.message || "Login failed");
          setLoading(false);
        });
    },
  });


  function handleLogin() {
    // console.log("Email:", email);
    // console.log("Password:", password);
    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Login Response:", response.data);
        if (response.data.success) {
          // Ensure success before showing toast
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
        console.log("Login Failed", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
        setLoading(false);
      });

    console.log("Login button clicked!");
  }

  

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/login-bg.jpg)] bg-cover bg-center flex">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center m-[5px] cursor-pointer"
          >
            {/* Login */}
            {loading ? "Loading..." : "Login"}
          </button>
          {/* google login */}
          <button
            className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center m-[5px] cursor-pointer flex items-center justify-center"
            onClick={loginWithGoogle}
          >
            {loading ? "Loading..." : "Login with Google "}
            <GrGoogle className="mr-[10px] ml-[10px]" />
            {/* Login with Google */}
          </button>
          <p className="text-gray-600 text-center m-[10px]">
            Don't have an account?{" "}
            <span className="text-green-500 cursor-pointer hover:text-green-700">
              <Link to={"/register"}>Register Now</Link>
            </span>
          </p>
          {/* forget password */}
          <p className="text-gray-600 text-center m-[10px]">
            Forget Your Password?{" "}
            <span className="text-green-500 cursor-pointer hover:text-green-700">
              <Link to={"/forget"}>Reset Password</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
