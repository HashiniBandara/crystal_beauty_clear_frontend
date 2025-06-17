import { Link } from "react-router-dom";
import ProductPage from "../pages/client/productPage";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

// import "./header.css"
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="w-full h-[70px] flex justify-start lg:justify-center items-center bg-gray-100 relative">
      <GiHamburgerMenu className="lg:hidden text-3xl absolute left-[30px] text-accent" onClick={() => setIsOpen(true)}/>
      <div className="w-[500px] h-full hidden lg:flex justify-evenly items-center text-xl text-pink-400">
        <Link to="/">
          <h1>Home</h1>
        </Link>
        <Link to="/products" element={<ProductPage />}>
          <h1>Products</h1>
        </Link>
        <Link to="/contact">
          <h1>Contact</h1>
        </Link>
        <Link to="/reviews">
          <h1>Reviews</h1>
        </Link>
        <Link to="/cart" className="absolute right-[30px] text-2xl">
          <BsCart4 />
        </Link>
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000060] flex z-10">
          <div className="w-[300px] bg-white h-full flex justify-start">
            <GiHamburgerMenu
              className="text-3xl absolute left-[30px] text-accent my-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            /> 
            <div className="w-[500px] h-full flex flex-col items-left pl-[30px] pt-[50px] gap-4 text-xl text-accent">
              <Link to="/">
                <h1>Home</h1>
              </Link>
              <Link to="/products" element={<ProductPage />}>
                <h1>Products</h1>
              </Link>
              <Link to="/contact">
                <h1>Contact</h1>
              </Link>
              <Link to="/reviews">
                <h1>Reviews</h1>
              </Link>
              <Link to="/cart" >
                <BsCart4 />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
