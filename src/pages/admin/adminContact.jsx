import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { FaSearch } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/contact", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setContacts(res.data.messages);
          setLoaded(true);
        });
    }
  }, [loaded]);

  const filtered = contacts.filter((msg) =>
    `${msg.name} ${msg.email} ${msg.message}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / messagesPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Contact Queries</h1>
        <span className="text-sm text-gray-600">Total: {contacts.length}</span>
      </div>

      <div className="mb-4 relative w-72">
        <input
          type="text"
          placeholder="Search by name, email, message"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-10 py-2 border rounded shadow-sm focus:outline-none focus:ring"
        />
        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded shadow border">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#802549] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b hover:bg-[#fdf6f0] text-left"
                  >
                    <td className="p-3">{msg.name}</td>
                    <td className="p-3">{msg.email}</td>
                    <td className="p-3 truncate max-w-[300px]">
                      {msg.message.slice(0, 50)}...
                    </td>
                    <td className="p-3">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        className="text-sm text-white bg-[#802549] px-3 py-1 rounded hover:bg-pink-900"
                        onClick={() => setModalData(msg)}
                      >
                        View
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

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] relative">
            <div className="w-full h-[50px] bg-[#802549] flex items-center justify-center rounded-t-2xl">
              <h2 className="text-lg font-semibold text-white">
                Message from {modalData.name}
              </h2>
            </div>
            <div className="p-6 space-y-3 text-gray-700 text-sm sm:text-base max-h-[400px] overflow-y-auto">
              <p>
                <strong>Name:</strong> {modalData.name}
              </p>
              <p>
                <strong>Email:</strong> {modalData.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(modalData.createdAt).toLocaleString()}
              </p>
              <div>
                <strong>Message:</strong>
                <p className="whitespace-pre-line mt-1 bg-[#fdf6f0] p-3 rounded border">
                  {modalData.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setModalData(null)}
              className="w-[40px] h-[40px] rounded-full bg-[#fdf6f0] shadow shadow-black flex justify-center items-center absolute top-[-20px] right-[-20px]"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
