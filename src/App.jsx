// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ProductCard from "./components/product-card";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes path="/*">
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>

    // <div className="bg-red-900">
    //   <Header />
    //   <ProductCard name="iPhone 16" description="Product description 1234568987" price="1000"/>
    //   <ProductCard name="iPhone 15 Pro Max" description="Product description 1234568987" price="1000"/>
    //   <ProductCard name="iPhone 14 Pro" description="Product description 1234568987" price="1000"/>
    //   <ProductCard name="iPhone 13 Pro" description="Product description 1234568987" price="1000"/>
    // </div>

    // <div className="w-full h-screen bg-pink-200">
    //   <div className="w-[500px] h-[500px] flex flex-col justify-center items-center  bg-gray-200 relative">
    //   <div className="w-[90px] h-[90px] bg-red-500 "></div>
    //   <div className="w-[90px] h-[90px] bg-yellow-500 absolute right-[50px] top-[50px]"></div>
    //   <div className="w-[90px] h-[90px] bg-blue-500 fixed right-[50px] bottom-[50px]"></div>
    //   <div className="w-[90px] h-[90px] bg-green-500"></div>
    // </div>
    // </div>

    // <LoginPage />

    // <AdminPage />
  );
}

export default App;
