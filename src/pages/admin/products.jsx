import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const productsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
        .then((res) => {
          setProducts(res.data);
          setLoaded(true);
        })
        .catch(() => toast.error("Failed to fetch products"));
    }
  }, [loaded]);

  async function confirmAndDelete(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to delete product");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Product deleted successfully");
      setLoaded(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete product");
    }
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <div className="w-full h-full p-4 overflow-auto relative">
      {/* <Link
        to="/admin/addProduct"
        className="absolute bottom-[5px] right-[5px] text-white bg-green-500 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-700 hover:text-green-500"
      >
        <FaPlus />
      </Link> */}
      <Link
        to="/admin/addProduct"
        className="fixed bottom-15 right-10 z-50 text-white bg-green-500 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-700 hover:text-green-500 shadow-lg"
      >
        <FaPlus />
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <span className="text-sm text-gray-600">Total: {products.length}</span>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          />
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="labeledPrice">Labeled Price</option>
          <option value="stock">Stock</option>
        </select>

        {sortBy && (
          <div className="text-gray-500">
            {sortOrder === "asc" ? (
              <FaSortAmountDown title="Ascending" />
            ) : (
              <FaSortAmountUp title="Descending" />
            )}
          </div>
        )}
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded shadow border">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#802549] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Labeled Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-[#fdf6f0] transition text-center"
                  >
                    <td className="p-3">{product.productId}</td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.price.toFixed(2)}</td>
                    <td className="p-3">{product.labeledPrice.toFixed(2)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <FaRegTrashAlt
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              message:
                                "Are you sure you want to delete this product?",
                              onConfirm: () =>
                                confirmAndDelete(product.productId),
                            })
                          }
                          className="text-[20px] hover:text-red-600 cursor-pointer"
                        />
                        {/* <GrEdit
                          onClick={() => navigate("/admin/editProduct", { state: product })}
                          className="text-[20px] hover:text-blue-600 cursor-pointer"
                        /> */}
                        <GrEdit
                          onClick={() => {
                            navigate("/admin/editProduct", { state: product });
                          }}
                          className="text-[20px] hover:text-blue-600 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <Loader />
      )}

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center space-y-4">
            <p className="text-md text-gray-700">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({
                    isOpen: false,
                    message: "",
                    onConfirm: null,
                  });
                }}
                className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() =>
                  setConfirmDialog({
                    isOpen: false,
                    message: "",
                    onConfirm: null,
                  })
                }
                className="px-4 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
