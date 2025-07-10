import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import Header from "../components/header";
import Footer from "../components/footer";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";
import HomePageDesign from "./client/home";
import UserProfile from "./client/UserProfile";
import SkincarePage from "./client/SkincarePage";
import MakeupPage from "./client/MakeupPage";
import HaircarePage from "./client/HaircarePage";
import ContactPage from "./client/ContactPage";
import FAQPage from "./client/FAQPage";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import NotFoundPage from "./client/NotFoundPage";

export default function HomePage() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Determine if near the bottom
      if (scrollY + windowHeight >= documentHeight - 10) {
        setAtBottom(true);
      } else {
        setAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (atBottom) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-grow mt-[70px]">
       <Routes path="/*">
          <Route path="/" element={<HomePageDesign />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/category/skincare" element={<SkincarePage />} />
          <Route path="/category/makeup" element={<MakeupPage />} />
          <Route path="/category/haircare" element={<HaircarePage />} />
           <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />

      {/* Floating Scroll Button */}
      <button
        onClick={handleScrollClick}
        className="fixed bottom-5 right-5 z-50 bg-[#e47da6] hover:bg-[#312122] text-white p-1 rounded-full shadow-lg transition duration-300"
        aria-label="Scroll Button"
      >
        {atBottom ? <IoIosArrowUp size={40} /> : <IoIosArrowDown size={40} />}
      </button>
    </div>
  );
}
