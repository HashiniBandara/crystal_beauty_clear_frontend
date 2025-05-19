import { Link } from "react-router-dom";
import ProductPage from "../pages/client/productPage";
import { BsCart4 } from "react-icons/bs";

// import "./header.css"
export default function Header(){
    return(
        <header className="w-full h-[70px] flex justify-center items-center bg-gray-100 relative">
           <div className="w-[500px] h-full flex justify-evenly items-center text-xl text-pink-400">
           <Link to="/"><h1>Home</h1></Link>
            <Link to="/products" element={<ProductPage/>}><h1>Products</h1></Link>
            <Link to="/contact"><h1>Contact</h1></Link>
            <Link to="/reviews"><h1>Reviews</h1></Link>
            <Link to="/cart" className="absolute right-[30px] text-2xl"><BsCart4 /></Link>
           </div>
        </header>
    )
}