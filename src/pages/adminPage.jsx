import { Link, Route, Routes } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { MdWarehouse } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa6";
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrdersPage from "./admin/adminOrders";

export default function AdminPage() {
  return (
    <div className="w-full h-screen bg-gray-200 flex p-2">
      <div className="h-full w-[300px] ">
       <Link to="/admin" className="block p-2  flex item-center"><TbLayoutDashboardFilled className="mr-2" /><h1>Dashboard</h1></Link>
       <Link to="/admin/users" className="block p-2  flex item-center"><FaUsers className="mr-2" /><h1>Users</h1></Link>
       <Link to="/admin/products" className="block p-2  flex item-center"><MdWarehouse className="mr-2" /><h1>Products</h1></Link>
       <Link to="/admin/orders" className="block p-2  flex item-center"><FaFileInvoice className="mr-2" /><h1>Orders</h1></Link>
      </div>

      <div className="h-full w-[calc(100%-300px)] bg-white rounded-lg">
        <Routes path="/*">
        <Route path="/" element={<h1>Dashboard</h1>} />
        <Route path="/users" element={<h1>Users</h1>} />
        <Route path="/products" element={<AdminProductsPage />} />
        <Route path="/addProduct" element={<AddProductForm />} />
        <Route path="/editProduct" element={<EditProductForm />} />
        <Route path="/orders" element={<AdminOrdersPage/>} />
        </Routes>
      </div>
    </div>
  );
}
