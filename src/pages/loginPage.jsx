import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // function handleLogin() {
  //   console.log("Email:", email);
  //   console.log("Password:", password);

  //   axios
  //     .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
  //       email: email,
  //       password: password,
  //     })
  //     .then((response) => {
  //       console.log("Login Successful", response.data);
  //       toast.success("Login successful");
  //       //  toast.error(response.data.message||"Login failed");
  //     })
  //     .catch((error) => {
  //       console.log("Login Failed", error.response.data);
  //       toast.error(error.response.data.message || "Login failed");
  //     });

  //   console.log("Login button clicked!");
  // }

  function handleLogin() {
    console.log("Email:", email);
    console.log("Password:", password);
  
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Login Response:", response.data);
        if (response.data.success) {  // Ensure success before showing toast
          toast.success("Login successful");
        } else {
          toast.error(response.data.message || "Login failed");
        }
        localStorage.setItem("token", response.data.token);

        const user=response.data.user;
        if(user.role === "admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/");
        }

      })
      .catch((error) => {
        console.log("Login Failed", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
      });
  
    console.log("Login button clicked!");
  }
  
  
  // function handleLogin() {
  //   console.log("Email:", email);
  //   console.log("Password:", password);

  //   axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
  //       email: email,
  //       password: password
  //     }).then((response) => {
  //       if (response.data && response.data.success) {  // Check if the response indicates success
  //         console.log("Login Successful", response.data);
  //       } else {
  //         console.log("Login Failed", response.data.message || "Unknown error");
  //       }
  //     }).catch((error) => {
  //       if (error.response) {
  //         console.log("Login Failed", error.response.data);
  //       } else {
  //         console.log("Login Failed due to network error or server not responding");
  //       }
  //     });

  //   console.log("Login button clicked!");
  // }

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
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
