import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import { FaPlus } from "react-icons/fa6";


export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });
  const categoriesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/categories")
        .then((res) => {
          setCategories(res.data);
          setLoaded(true);
        })
        .catch(() => toast.error("Failed to fetch categories"));
    }
  }, [loaded]);

  async function confirmAndDelete(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to delete category");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setLoaded(false);
      toast.success("Category deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete category");
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
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

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);

  return (
    <div className="w-full h-full p-4 overflow-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Categories</h1>
        <span className="text-sm text-gray-600">Total: {categories.length}</span>
      </div>

      {/* Filters */}
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
          <option value="name">Name</option>
        </select>

        {sortBy && (
          <div className="text-gray-500">
            {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
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
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((category, index) => (
                  <tr key={index} className="border-b hover:bg-[#fdf6f0] transition">
                    <td className="p-3">{category.categoryId}</td>
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">
                      <img
                        src={category.image}
                        alt="category"
                        className="w-[60px] h-[60px] object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3">{category.description}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <FaRegTrashAlt
                          onClick={() =>
                            setConfirmDialog({
                              isOpen: true,
                              message: `Are you sure you want to delete this category?`,
                              onConfirm: () => confirmAndDelete(category.categoryId),
                            })
                          }
                          className="text-[18px] text-gray-600 hover:text-red-600 cursor-pointer"
                        />
                        <GrEdit
                          onClick={() => navigate("/admin/editCategory", { state: category })}
                          className="text-[18px] text-gray-600 hover:text-blue-600 cursor-pointer"
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

      {/* Floating Add Button */}
      {/* <Link
        to="/admin/addCategory"
        className="absolute bottom-5 right-5 text-white bg-green-500 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-700 hover:text-green-400"
      >
        <FaPlus />
      </Link> */}

            <Link
        to="/admin/addCategory"
        className="fixed bottom-15 right-10 z-50 text-white bg-green-500 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-700 hover:text-green-500 shadow-lg"
      >
        <FaPlus />
      </Link>

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center space-y-4">
            <p className="text-md text-gray-700">{confirmDialog.message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
                }}
                className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDialog({ isOpen: false, message: "", onConfirm: null })}
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
