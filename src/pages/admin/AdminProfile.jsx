import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUserCircle,
  FaUserEdit,
  FaKey,
} from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    image: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.user;
        if (user.role !== "admin") {
          toast.error("Access denied");
          return;
        }
        setAdmin(user);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          image: user.image || "",
        });
        setImagePreview(user.image || null);
      })
      .catch(() => toast.error("Failed to fetch profile"));
  }, []);

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        toast.loading("Uploading image...");
        imageUrl = await mediaUpload(imageFile);
        toast.dismiss();
        toast.success("Image uploaded");
      }

      const updatedData = { ...formData, image: imageUrl };

      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/user/update",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setAdmin(res.data.user);
      setFormData({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        phone: res.data.user.phone,
        image: res.data.user.image,
      });
      setImagePreview(res.data.user.image || null);
      setEditMode(false);
      setImageFile(null);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL + "/api/user/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Password updated");
        setChangePasswordMode(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch(() => toast.error("Failed to change password"));
  };

  if (!admin) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen  p-4 sm:p-6">
      <div className="w-full max-w-xl mx-auto rounded-2xl shadow-xl p-6 sm:p-8 bg-[#fbfcfc]">
        <div className="flex justify-center mb-4 flex-col items-center">
          <img
            src={
              imagePreview ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Admin"
            className="w-24 h-24 rounded-full border object-cover shadow mb-2"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="text-sm text-pink-700"
            />
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 flex items-center justify-center gap-2 text-[#802549]">
          {editMode ? (
            <FaUserEdit className="text-3xl" />
          ) : changePasswordMode ? (
            <FaKey className="text-3xl" />
          ) : (
            <FaUserCircle className="text-3xl" />
          )}
          {editMode
            ? "Edit Profile"
            : changePasswordMode
            ? "Change Password"
            : "Admin Profile"}
        </h2>

        {/* View Mode */}
        {!editMode && !changePasswordMode && (
          <div className="text-center space-y-3 text-[#802549]">
            <p>
              <strong>Name:</strong> {admin.firstName} {admin.lastName}
            </p>
            <p>
              <strong>Email:</strong> {admin.email}
            </p>
            <p>
              <strong>Phone:</strong> {admin.phone || "N/A"}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-2 rounded-lg shadow font-semibold"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className="bg-pink-100 text-pink-700 hover:bg-pink-200 px-6 py-2 rounded-lg shadow font-semibold"
                onClick={() => setChangePasswordMode(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProfileUpdate();
            }}
            className="space-y-4 text-[#802549]"
          >
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              required
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              required
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-pink-700 text-white px-6 py-2 rounded-lg hover:bg-pink-800 font-semibold shadow"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded-lg shadow"
                onClick={() => {
                  setEditMode(false);
                  setImageFile(null);
                  setImagePreview(formData.image || null);
                  setFormData({
                    firstName: admin.firstName || "",
                    lastName: admin.lastName || "",
                    phone: admin.phone || "",
                    image: admin.image || "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Change Password Mode */}
        {changePasswordMode && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordChange();
            }}
            className="space-y-4 text-[#802549]"
          >
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-600"
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-pink-700 text-white px-6 py-2 rounded-lg hover:bg-pink-800 font-semibold shadow"
              >
                Change
              </button>
              <button
                type="button"
                className="bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded-lg shadow"
                onClick={() => {
                  setChangePasswordMode(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
