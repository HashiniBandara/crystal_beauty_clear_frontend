// export default function Footer() {
//   return (
//     <footer className="bg-[#802549] text-white text-center py-6">
//       <p className="text-sm">&copy; 2025 Cristal Beauty Clear. All rights reserved.</p>
//     </footer>
//   );
// }
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#802549] text-white pt-10 pb-6 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {/* Logo & Description */}
        <div>
          <img
            src="/logo/cbc-logo-new.png" 
            alt="Cristal Beauty Clear"
            className="w-[300px] h-auto mb-4"
          />
          <p>
            Cristal Beauty Clear offers naturally inspired skincare and beauty products for glowing confidence. Clean, kind, and crafted with care.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt /> 123 Beauty Lane, Colombo, Sri Lanka
          </p>
          <p className="flex items-center gap-2 mb-2">
            <FaPhoneAlt /> +94 77 123 4567
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope /> support@cristalbeauty.com
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="hover:underline">Shop</Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">FAQs</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-200">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 border-t border-white/20 pt-4 text-sm">
        &copy; {new Date().getFullYear()} Cristal Beauty Clear. All rights reserved.
      </div>
    </footer>
  );
}
