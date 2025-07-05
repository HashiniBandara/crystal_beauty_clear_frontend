import ProductCard from "../../components/product-card";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";

export default function MakeupPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryId = "C0002";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`);
      const filtered = res.data.filter((p) => p.categoryId === categoryId);
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching makeup products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#802549] pt-28 pb-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Discover Makeup Products</h1>
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No makeup products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
