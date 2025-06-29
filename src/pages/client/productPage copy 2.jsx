import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ProductCard from "../../components/product-card";
import { FaSearch, FaUndo } from "react-icons/fa";

export default function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productsLoaded) {
      fetchProducts();
    }
  }, [productsLoaded]);

  function fetchProducts() {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product/")
      .then((res) => {
        setProductList(res.data);
        setLoading(false);
        setProductsLoaded(true);
      });
  }

  function searchProducts() {
    if (search.trim().length > 0) {
      setLoading(true);
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/search/" + search)
        .then((res) => {
          setProductList(res.data.products);
          setLoading(false);
        });
    }
  }

  function resetSearch() {
    setSearch("");
    setProductsLoaded(false);
  }

  return (
    <div className="w-full min-h-screen px-6 pt-28 pb-16 bg-[#fdf6f0] font-sans text-[#802549]">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <div className="flex gap-3">
          <button
            onClick={searchProducts}
            className="flex items-center gap-2 bg-[#802549] hover:bg-pink-700 text-white px-6 py-3 rounded-full transition"
          >
            <FaSearch />
            Search
          </button>
          <button
            onClick={resetSearch}
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-[#802549] px-6 py-3 rounded-full transition"
          >
            <FaUndo />
            Reset
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {productList.length > 0 ? (
            productList.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))
          ) : (
            <p className="text-center w-full text-lg text-gray-500 col-span-full">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
