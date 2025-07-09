import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Loader from "../../components/loader";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });
  const usersPerPage = 10;

  const loggedInEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/all`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUsers(res.data);
          setLoaded(true);
        })
        .catch(() => toast.error("Failed to fetch users"));
    }
  }, [loaded]);

  async function confirmAndToggle(email, status) {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/block`,
        { email, isDisabled: !status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      toast.success(`User ${status ? "unblocked" : "blocked"} successfully`);
      setLoaded(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update user status");
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

  const filteredUsers = users
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (statusFilter === "active" && user.isDisabled) return false;
      if (statusFilter === "blocked" && !user.isDisabled) return false;
      return true;
    });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = sortBy === "status" ? a.isDisabled : a[sortBy];
    const bVal = sortBy === "status" ? b.isDisabled : b[sortBy];
    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Users</h1>
        <span className="text-sm text-gray-600">Total: {users.length}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search input */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by name, email, role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          />
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Filters */}
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded shadow-sm">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded shadow-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => handleSort(e.target.value)} className="px-3 py-2 border rounded shadow-sm">
          <option value="">Sort By</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </select>

        {sortBy && (
          <div className="text-gray-500">
            {sortOrder === "asc" ? <FaSortAmountDown title="Ascending" /> : <FaSortAmountUp title="Descending" />}
          </div>
        )}
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded shadow border">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#802549] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-[#fdf6f0] transition">
                    <td className="p-3">
                      {user.email}
                      {user.email === loggedInEmail && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">You</span>
                      )}
                    </td>
                    <td className="p-3 capitalize">{user.firstName} {user.lastName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{user.phone || "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-sm rounded-full font-medium ${
                        user.isDisabled
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {user.isDisabled ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            message: `Are you sure you want to ${user.isDisabled ? "unblock" : "block"} this user?`,
                            onConfirm: () => confirmAndToggle(user.email, user.isDisabled),
                          })
                        }
                        className={`px-4 py-1 text-sm rounded transition text-white ${
                          user.isDisabled
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {user.isDisabled ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50">Prev</button>
            <span className="px-3 py-1 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 disabled:opacity-50">Next</button>
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
