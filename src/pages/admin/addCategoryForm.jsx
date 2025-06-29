import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddCategoryForm() {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  async function handleSubmit() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add category");
      return;
    }

    try {
      let uploadedImage = "";
      if (image) {
        uploadedImage = await mediaUpload(image);
      }

      const category = {
        categoryId,
        name,
        description,
        image: uploadedImage,
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, category, {
        headers: { Authorization: "Bearer " + token },
      });

      toast.success("Category added successfully");
      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="max-w-2xl mx-auto bg-white shadow-md border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add New Category</h2>
          <Link
            to="/admin/categories"
            className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />

          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring resize-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
                onLoad={() => URL.revokeObjectURL(imagePreview)}
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link
              to="/admin/categories"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
