import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function EditCategoryForm() {
  const locationData = useLocation();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(locationData.state?.categoryId || "");
  const [name, setName] = useState(locationData.state?.name || "");
  const [description, setDescription] = useState(locationData.state?.description || "");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(locationData.state?.image || "");
  const [preview, setPreview] = useState("");

  if (!locationData.state) {
    toast.error("Please select a category to edit");
    navigate("/admin/categories");
    return null;
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  async function handleSubmit() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to edit category");
      return;
    }

    try {
      let uploadedImage = existingImage;
      if (image) {
        uploadedImage = await mediaUpload(image);
      }

      const updatedCategory = {
        categoryId,
        name,
        description,
        image: uploadedImage,
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories/${categoryId}`,
        updatedCategory,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      toast.success("Category updated successfully");
      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  }

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="max-w-2xl mx-auto bg-white shadow-md border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
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
            value={categoryId}
            disabled
            className="w-full px-4 py-2 border rounded bg-gray-100"
            placeholder="Category ID"
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Category Name"
          />

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded resize-none"
            placeholder="Description"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded"
          />

          {/* Show Existing Image */}
          {existingImage && !image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Existing Image:</p>
              <img
                src={existingImage}
                alt="Existing"
                className="w-24 h-24 object-cover border rounded"
              />
            </div>
          )}

          {/* Show New Preview if Selected */}
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">New Selected Image:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover border rounded"
                onLoad={() => URL.revokeObjectURL(preview)}
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              Update Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
