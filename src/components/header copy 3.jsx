import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import UserData from "./userData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-[#802549]">
          {/* Cristal Beauty Clear */}
          <img src="/logo/cbc-logo-new.png" alt="Cristal Beauty Clear" className="h-12"/>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-[#802549] text-base font-medium">
          <Link to="/" className="hover:text-pink-700 transition">Home</Link>
          <Link to="/products" className="hover:text-pink-700 transition">Products</Link>
          {/* dropdown menu category - skincare,makeup,haircare */}
          <div className="relative">
            <button className="hover:text-pink-700 transition">Categories</button>
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md">
              <Link to="/category/skincare" className="block px-4 py-2 hover:bg-gray-100">Skincare</Link>
              <Link to="/category/makeup" className="block px-4 py-2 hover:bg-gray-100">Makeup</Link>
              <Link to="/category/haircare" className="block px-4 py-2 hover:bg-gray-100">Haircare</Link>
            </div>
          </div>
          <Link to="/contact" className="hover:text-pink-700 transition">Contact</Link>
          <Link to="/reviews" className="hover:text-pink-700 transition">Reviews</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-5">
          <UserData />
          <Link to="/cart" className="text-2xl text-[#802549] hover:text-pink-700 transition">
            <BsCart4 />
          </Link>
          <button className="lg:hidden text-3xl text-[#802549]" onClick={() => setIsOpen(true)}>
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-white p-6 space-y-6 shadow-lg">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xl font-bold text-[#802549]">Menu</span>
              <button onClick={() => setIsOpen(false)} className="text-2xl text-pink-600">&times;</button>
            </div>
            <nav className="flex flex-col space-y-4 text-[#802549] font-medium">
              <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-pink-700 transition">Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-pink-700 transition">Products</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-pink-700 transition">Contact</Link>
              <Link to="/reviews" onClick={() => setIsOpen(false)} className="hover:text-pink-700 transition">Reviews</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 hover:text-pink-700 transition">
                <BsCart4 />
                <span>Cart</span>
              </Link>
            </nav>
          </div>

          {/* Overlay */}
          <div className="flex-1 bg-black/30" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </header>
  );
}
