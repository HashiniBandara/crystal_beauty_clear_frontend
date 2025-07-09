import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import {
  FaRegStar,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaStar,
} from "react-icons/fa";
import { IoClose, IoCloseSharp } from "react-icons/io5";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
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
  const [selectedReview, setSelectedReview] = useState(null); // Modal state
  const reviewsPerPage = 10;

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/review/all`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setReviews(res.data);
          setLoaded(true);
        })
        .catch(() => toast.error("Failed to fetch reviews"));
    }
  }, [loaded]);

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  const filteredReviews = reviews.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const aVal = sortBy === "rating" ? a.rating : a[sortBy] || "";
    const bVal = sortBy === "rating" ? b.rating : b[sortBy] || "";
    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const indexOfLast = currentPage * reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfLast - reviewsPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  async function toggleBlock(reviewId, block) {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/review/block`,
        {
          reviewId,
          isBlocked: block,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      toast.success(`Review ${block ? "blocked" : "unblocked"} successfully`);
      setLoaded(false);
    } catch {
      toast.error("Failed to update review status");
    }
  }

  // Function to handle opening the modal
  function handleViewClick(review) {
    setSelectedReview(review); // Set the review to show in the modal
  }

  // Function to close the modal
  function closeModal() {
    setSelectedReview(null); // Close the modal by resetting the review
  }

  return (
    <div className="w-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Reviews</h1>
        <span className="text-sm text-gray-600">Total: {reviews.length}</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by name, email, product ID or comment"
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
          <option value="rating">Rating</option>
          <option value="createdAt">Date</option>
          <option value="userName">Name</option>
        </select>

        {sortBy && (
          <div className="text-gray-500">
            {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
          </div>
        )}
      </div>

      {/* Table */}
      {loaded ? (
        <>
          <div className="overflow-x-auto border rounded shadow">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#802549] text-white">
                <tr>
                  {/* <th className="p-3 text-left">User</th> */}
                  <th className="p-3 text-left">User Email</th>
                  <th className="p-3 text-left">Product ID</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Comment</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-[#fdf6f0] transition"
                  >
                    {/* <td className="p-3 capitalize">{r.userName}</td> */}
                    <td className="p-3 text-gray-500">{r.userEmail}</td>
                    <td className="p-3 text-gray-600">{r.productId}</td>
                    <td className="p-3 text-yellow-500">
                      {Array(r.rating).fill("★").join("")}
                    </td>
                    <td className="p-3 text-gray-700 max-w-[300px] truncate">
                      {/* View button */}
                      <button
                        onClick={() => handleViewClick(r)}
                        className="ml-2 px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        View
                      </button>
                      {/* {r.comment} */}
                    </td>
                    <td className="p-3 text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-sm rounded-full font-medium ${
                          r.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {r.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            message: `Are you sure you want to ${
                              r.isBlocked ? "unblock" : "block"
                            } this review?`,
                            onConfirm: () =>
                              toggleBlock(r.reviewId, !r.isBlocked),
                          })
                        }
                        className={`px-4 py-1 text-sm rounded text-white transition ${
                          r.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {r.isBlocked ? "Unblock" : "Block"}
                      </button>
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

      {/* Review Details Modal */}
      {/* {selectedReview && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] text-center space-y-4">
            <h2 className="text-xl font-semibold">Review Details</h2>
            <p><strong>User:</strong> {selectedReview.userName}</p>
            <p><strong>Email:</strong> {selectedReview.userEmail}</p>
            <p><strong>Product ID:</strong> {selectedReview.productId}</p>
            <p><strong>Rating:</strong> {Array(selectedReview.rating).fill("★").join("")}</p>
            <p><strong>Comment:</strong> {selectedReview.comment}</p>
            <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleDateString()}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
 
{/* Review Details Modal */}
{selectedReview && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
      
      {/* Full-width header with no white space */}
      <div className="w-full h-[50px] bg-[#802549] flex items-center justify-center rounded-t-2xl">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Review Details
        </h2>
      </div>

      {/* Content with padding */}
      <div className="p-6 sm:p-8">
        {/* <div className="h-1 w-20 bg-pink-400 mx-auto mb-6 rounded-full"></div> */}

        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          <p><span className="font-semibold">User:</span> {selectedReview.userName}</p>
          <p><span className="font-semibold">Email:</span> {selectedReview.userEmail}</p>
          <p><span className="font-semibold">Product ID:</span> {selectedReview.productId}</p>
          <p className="flex items-center gap-1">
            <span className="font-semibold">Rating:</span>
            {Array.from({ length: 5 }).map((_, i) =>
              i < selectedReview.rating ? (
                <FaStar key={i} className="text-yellow-400" />
              ) : (
                <FaRegStar key={i} className="text-gray-300" />
              )
            )}
          </p>
          <p><span className="font-semibold">Comment:</span> {selectedReview.comment}</p>
          <p><span className="font-semibold">Date:</span> {new Date(selectedReview.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Close Icon Button */}
      <button
        onClick={closeModal}
        className="w-[40px] h-[40px] rounded-full bg-[#fdf6f0] shadow shadow-black flex justify-center items-center absolute top-[-20px] right-[-20px]"
      >
        <IoCloseSharp />
      </button>
    </div>
  </div>
)}



      {/* Confirmation Modal */}
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
