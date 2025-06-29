import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();

  if (!locationData.state) {
    toast.error("Please select a product to edit");
    navigate("/admin/products");
    return null;
  }

  const [productId] = useState(locationData.state.productId);
  const [name, setName] = useState(locationData.state.name);
  const [altName, setAltName] = useState(locationData.state.altName.join(","));
  const [price, setPrice] = useState(locationData.state.price);
  const [labeledPrice, setLabeledPrice] = useState(locationData.state.labeledPrice);
  const [description, setDescription] = useState(locationData.state.description);
  const [stock, setStock] = useState(locationData.state.stock);
  const [categoryId, setCategoryId] = useState(locationData.state.categoryId || "");
  const [isFeatured, setIsFeatured] = useState(locationData.state.isFeatured || false);
  const [isTrending, setIsTrending] = useState(locationData.state.isTrending || false);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // new selected files
  const [imagePreviews, setImagePreviews] = useState([]); // new preview urls
  const [existingImages, setExistingImages] = useState(locationData.state.images || []); // stored image URLs

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  }

  function handleRemoveExistingImage(index) {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  }

  function resetNewImages() {
    setImages([]);
    setImagePreviews([]);
  }

  async function handleSubmit() {
    try {
      let uploadedImages = [];

      if (images.length > 0) {
        uploadedImages = await Promise.all(images.map((file) => mediaUpload(file)));
      }

      const finalImages = [...existingImages, ...uploadedImages];

      const product = {
        productId,
        name,
        altName: altName.split(","),
        price,
        labeledPrice,
        description,
        stock,
        images: finalImages,
        categoryId,
        isFeatured,
        isTrending,
      };

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
        product,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  }

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="max-w-3xl mx-auto bg-white shadow-md border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <Link
            to="/admin/products"
            className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </Link>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={productId}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
              placeholder="Product ID"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Product Name"
            />
            <input
              type="text"
              value={altName}
              onChange={(e) => setAltName(e.target.value)}
              className="w-full px-4 py-2 border rounded col-span-1 sm:col-span-2"
              placeholder="Alternative Names (comma separated)"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Price"
            />
            <input
              type="number"
              value={labeledPrice}
              onChange={(e) => setLabeledPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Labeled Price"
            />
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Stock"
            />
          </div>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded resize-none"
            placeholder="Description"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Existing Image Previews with Remove */}
          {existingImages.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Existing Images:</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Existing ${index}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Input */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded mt-2"
          />

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">New Selected Images:</p>
                <button
                  onClick={resetNewImages}
                  className="text-xs text-red-600 hover:underline"
                >
                  Reset New Images
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i}`}
                    className="w-24 h-24 object-cover border rounded"
                    onLoad={() => URL.revokeObjectURL(src)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Checkboxes */}
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
