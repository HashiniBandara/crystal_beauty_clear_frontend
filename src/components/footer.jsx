import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#802549] text-white pt-10 pb-6 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Logo + Description + Contact */}
        <div className="flex flex-col gap-6">
          <div>
            <img
              src="/logo/cbc-logo-new.png"
              alt="Cristal Beauty Clear"
              className="w-[160px] h-auto mb-3"
            />

            <p className="leading-relaxed text-justify max-w-md">
              Cristal Beauty Clear offers naturally inspired skincare and beauty
              products for glowing confidence. Clean, kind, and crafted with
              care.
            </p>

            {/* Social Media */}
            <div>
              <h4 className="text-base font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-4 text-xl mt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-200 transition"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-200 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-200 transition"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-200 transition"
                >
                  <SiTiktok />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links + Social Media */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:underline hover:text-pink-200 transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:underline hover:text-pink-200 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:underline hover:text-pink-200 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="hover:underline hover:text-pink-200 transition"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:underline hover:text-pink-200 transition"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1" />
                <span>123 Beauty Lane, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope />
                <span>support@cristalbeauty.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 border-t border-white/20 pt-3 text-sm">
        &copy; {new Date().getFullYear()} Cristal Beauty Clear. All rights
        reserved.
      </div>
    </footer>
  );
}
