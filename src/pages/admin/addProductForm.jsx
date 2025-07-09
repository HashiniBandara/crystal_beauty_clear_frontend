import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // <-- For previews
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Update image files and create previews
  function handleImageChange(e) {
    const files = e.target.files;
    setImages(files);

    // Create object URLs for previews
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  }

  async function handleSubmit() {
    const token = localStorage.getItem("token");
    const altNameInArray = altName.split(",");

    try {
      const uploadedImages = await Promise.all(
        [...images].map((file) => mediaUpload(file))
      );

      const product = {
        productId,
        name,
        altName: altNameInArray,
        price,
        labeledPrice,
        description,
        images: uploadedImages,
        stock,
        categoryId,
        isFeatured,
        isTrending,
      };

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/product",
        product,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }
  }

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="max-w-3xl mx-auto bg-white shadow-md border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
          <Link
            to="/admin/products"
            className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>

        <div className="space-y-4">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
            <input
              type="text"
              placeholder="Alternative Names (comma separated)"
              value={altName}
              onChange={(e) => setAltName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring col-span-1 sm:col-span-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
            <input
              type="number"
              placeholder="Labeled Price"
              value={labeledPrice}
              onChange={(e) => setLabeledPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring resize-none"
          />

          {/* Category */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Image Upload */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />

          {/* Image Preview */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {imagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                  onLoad={() => URL.revokeObjectURL(src)} // release memory after load
                />
              ))}
            </div>
          )}

          {/* Feature Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
              <span>Trending</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
