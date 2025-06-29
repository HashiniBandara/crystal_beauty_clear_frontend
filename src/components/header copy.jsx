import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import UserData from "./userData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#b41d19] tracking-wide">
          Cristal Beauty Clear
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-pink-700 text-lg font-medium">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/reviews">Reviews</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-5">
          <UserData />
          <Link to="/cart" className="text-2xl text-red-700 hover:text-red-800">
            <BsCart4 />
          </Link>
          {/* Hamburger Menu */}
          <button className="lg:hidden text-3xl text-red-700" onClick={() => setIsOpen(true)}>
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="w-64 bg-white p-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-red-700">Menu</span>
              <button onClick={() => setIsOpen(false)} className="text-2xl text-pink-600">
                &times;
              </button>
            </div>
            <nav className="flex flex-col space-y-4 text-pink-700 text-lg">
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
              <Link to="/reviews" onClick={() => setIsOpen(false)}>Reviews</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                <BsCart4 />
                <span>Cart</span>
              </Link>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
