import { Link } from "react-router-dom";
import { FaSadTear } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 py-20 font-sans text-[#802549] bg-[#fff5f8]">
      <FaSadTear size={80} className="text-pink-400 mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#802549] hover:bg-pink-700 text-white px-6 py-3 rounded-full shadow-lg transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
