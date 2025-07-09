import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";
import HomePageDesign from "./client/home";
import UserProfile from "./client/UserProfile";
import Footer from "../components/footer";
import SkincarePage from "./client/SkincarePage";
import MakeupPage from "./client/MakeupPage";
import HaircarePage from "./client/HaircarePage";
import ContactPage from "./client/ContactPage";
import FAQPage from "./client/FAQPage";

// export default function HomePage() {
//   return (
//     <div className="w-full h-screen max-h-screen">
//       <Header />
//       <div className="w-full h-[calc(100%-70px)] min-h-[calc(100%-70px)]">
//         <Routes path="/*">
//           <Route path="/" element={<HomePageDesign />} />
//           <Route path="/products" element={<ProductPage />} />
//           <Route path="/overview/:id" element={<ProductOverview />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/checkout" element={<CheckoutPage />} />
//           <Route path="/profile" element={<UserProfile />} />

//           <Route path="/*" element={<h1>404 Not Found</h1>} />
//         </Routes>
//       </div>
//        <Footer />
//     </div>

//   );
// }

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
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
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
      <Footer /> {/* Always at the bottom */}
    </div>
  );
}
