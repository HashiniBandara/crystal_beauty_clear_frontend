import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { MdWarehouse } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa6";
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";
import AdminOrdersPage from "./admin/adminOrders";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("You are not logged in");
      navigate("/login");
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response.data.user.role == "admin") {
            setUserValidated(true);
          } else {
            toast.error("You are not an admin");
            navigate("/login");
          }
        })
        .catch(() => {
          toast.error("Something went wrong please login again");
          navigate("/login");
        });
    }
  }, []);

//   useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     toast.error("You are not logged in");
//     navigate("/login");
//     return;
//   }

//   // Use a small delay or flag to ensure token is there
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "api/user/current", {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });

//       if (res.data.user.role === "admin") {
//         setUserValidated(true);
//       } else {
//         toast.error("You are not an admin");
//         navigate("/login");
//       }
//     } catch (err) {
//       toast.error("Something went wrong please login again");
//       navigate("/login");
//     }
//   };

//   fetchData();
// }, []);


// useEffect(() => {
//   const token = localStorage.getItem("token");
//   console.log("Token from localStorage:", token);

//   if (!token) {
//     toast.error("You are not logged in");
//     navigate("/login");
//     return;
//   }

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });

//       console.log("Admin check response:", res.data);

//       if (res.data.user.role === "admin") {
//         setUserValidated(true);
//       } else {
//         toast.error("You are not an admin");
//         navigate("/login");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast.error("Something went wrong please login again");
//       navigate("/login");
//     }
//   };

//   fetchData();
// }, []);


  return (
    <div className="w-full h-screen bg-gray-200 flex p-2">
      {userValidated ? (
        <>
          <div className="h-full w-[300px] ">
            <Link to="/admin" className="block p-2  flex item-center">
              <TbLayoutDashboardFilled className="mr-2" />
              <h1>Dashboard</h1>
            </Link>
            <Link to="/admin/users" className="block p-2  flex item-center">
              <FaUsers className="mr-2" />
              <h1>Users</h1>
            </Link>
            <Link to="/admin/products" className="block p-2  flex item-center">
              <MdWarehouse className="mr-2" />
              <h1>Products</h1>
            </Link>
            <Link to="/admin/orders" className="block p-2  flex item-center">
              <FaFileInvoice className="mr-2" />
              <h1>Orders</h1>
            </Link>
          </div>

          <div className="h-full w-[calc(100%-300px)] bg-white rounded-lg">
            <Routes path="/*">
              <Route path="/" element={<h1>Dashboard</h1>} />
              <Route path="/users" element={<h1>Users</h1>} />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/addProduct" element={<AddProductForm />} />
              <Route path="/editProduct" element={<EditProductForm />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
            </Routes>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
