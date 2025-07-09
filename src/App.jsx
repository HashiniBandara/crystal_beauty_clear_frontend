// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ProductCard from "./components/product-card";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";
import Testing from "./pages/testing";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/client/register";
import HomePage from "./pages/homePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPassword from "./pages/client/forgetPassword";

function App() {
  return (

    // clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
     <BrowserRouter>
      <Toaster position="top-right" />
      <Routes path="/*">
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/testing" element={<Testing />} />
        {/* <Route path="/" element={<h1>Home</h1>} /> */}
        {/* <Route path="/*" element={<h1>404 Not Found</h1>} /> */}
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
   </GoogleOAuthProvider>


  );
}

export default App;
