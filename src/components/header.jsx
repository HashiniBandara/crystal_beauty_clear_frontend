import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import UserData from "./userData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-[#802549]">
          <img src="/logo/cbc-logo-new.png" alt="Cristal Beauty Clear" className="h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-[#802549] text-base font-medium relative">
          <Link to="/" className="hover:text-pink-700 transition">Home</Link>
          <Link to="/products" className="hover:text-pink-700 transition">Products</Link>

          {/* Category Dropdown */}
          <div className="relative group">
            <button className="hover:text-pink-700 transition">Categories</button>
            <div className="absolute top-full left-0 mt-3 w-44 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition duration-200 origin-top">
              <Link to="/category/skincare" className="block px-4 py-2 hover:bg-pink-50">Skincare</Link>
              <Link to="/category/makeup" className="block px-4 py-2 hover:bg-pink-50">Makeup</Link>
              <Link to="/category/haircare" className="block px-4 py-2 hover:bg-pink-50">Haircare</Link>
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

              {/* Expandable Categories */}
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="text-left hover:text-pink-700 transition"
              >
                Categories {isCategoryOpen ? "▾" : "▸"}
              </button>
              {isCategoryOpen && (
                <div className="ml-4 space-y-2">
                  <Link to="/category/skincare" onClick={() => setIsOpen(false)} className="block hover:text-pink-700 transition">Skincare</Link>
                  <Link to="/category/makeup" onClick={() => setIsOpen(false)} className="block hover:text-pink-700 transition">Makeup</Link>
                  <Link to="/category/haircare" onClick={() => setIsOpen(false)} className="block hover:text-pink-700 transition">Haircare</Link>
                </div>
              )}

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
