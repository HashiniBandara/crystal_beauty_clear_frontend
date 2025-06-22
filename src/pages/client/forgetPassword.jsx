import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

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
        email: email,
        otp: otp,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Password changed successfully");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error);
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
        console.log(response.data);
        setEmailSent(true);
        toast.success("Email sent successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Email sending failed");
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {emailSent ? (
        // reset password page -> otp, password, confirm password
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Reset Your Password
          </h2>
          {/* otp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              id="otp"
              required
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 mt-4"
            onClick={changePassword}
          >
            Reset Password
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Forgot Your Password?
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              name="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 mt-4"
            onClick={sendEmail}
          >
            Send OTP
          </button>

          <div className="text-sm text-center mt-6">
            <a href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
