import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function changePassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/changePw", {
        email,
        otp,
        password,
      })
      .then((response) => {
        toast.success("Password changed successfully");
        window.location.href = "/login";
      })
      .catch((error) => {
        toast.error("Something went wrong");
        window.location.reload();
      });
  }

  function sendEmail() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/sendMail", {
        email: email,
      })
      .then((response) => {
        setEmailSent(true);
        toast.success("OTP sent successfully");
      })
      .catch((error) => {
        toast.error("Email sending failed");
      });
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl max-w-md w-full p-8 sm:p-10 flex flex-col items-center">
        {/* Logo */}
        <img src="/logo/cbc-logo-withoutbg.png" alt="Logo" className="w-[300px] h-auto mb-6" />

        {emailSent ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Reset Your Password
            </h2>

            {/* OTP */}
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <button
              type="button"
              onClick={changePassword}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              Reset Password
            </button>

            <p className="text-sm text-center mt-4">
              <Link to="/login" className="text-pink-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter your email address. We'll send you an OTP to reset your password.
            </p>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <button
              type="button"
              onClick={sendEmail}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              Send OTP
            </button>

            <p className="text-sm text-center mt-4">
              <Link to="/login" className="text-pink-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
