import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/product-card";
import Loader from "../../components/loader";
import { FaSearch, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchProductReviews = async (visibleProducts) => {
    const reviewResults = await Promise.all(
      visibleProducts.map((product) =>
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/api/review/product/${product.productId}`)
          .then((res) => ({ productId: product.productId, reviews: res.data }))
          .catch(() => ({ productId: product.productId, reviews: [] }))
      )
    );

    const map = {};
    reviewResults.forEach(({ productId, reviews }) => {
      const avg =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
      map[productId] = avg;
    });

    setReviewMap(map);
  };

  const handleSearch = async () => {
    if (!search) return fetchProducts();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/search/${search}`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.categoryId === categoryFilter);
    }

    switch (sortOption) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    const limited = filtered.slice(0, visibleCount);
    setDisplayedProducts(limited);
    fetchProductReviews(limited);
  }, [products, categoryFilter, sortOption, visibleCount]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex gap-1 mt-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen w-full px-4 pt-28 pb-16 font-sans bg-[#fdf6f0] text-[#802549]">
      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <div className="flex items-center border border-gray-300 rounded-full px-4 w-full max-w-md bg-white shadow-sm">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full p-2 outline-none bg-transparent"
          />
        </div>
        <button
          className="bg-[#802549] text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="bg-gray-200 text-[#802549] px-4 py-2 rounded-full hover:bg-gray-300"
          onClick={fetchProducts}
        >
          Reset
        </button>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-pink-300 px-4 py-2 rounded-xl text-[#802549] bg-[#fff0f5] shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-pink-300 px-4 py-2 rounded-xl text-[#802549] bg-[#fff0f5] shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        >
          <option className="hover:bg-[#fff0f5] hover:text-white " value="latest">Sort by: Latest</option>
          <option className="hover:bg-[#fff0f5] hover:text-white " value="priceLowHigh">Price: Low to High</option>
          <option className="hover:bg-[#fff0f5] hover:text-white " value="priceHighLow">Price: High to Low</option>
        </select>
        
      </div>
      

      {/* Product Grid */}
      {loading ? (
        <Loader />
      ) : displayedProducts.length === 0 ? (
        <div className="text-center text-xl text-gray-500 mt-12">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <Link
              to={`/overview/${product.productId}`}
              key={product.productId}
              className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition w-full max-w-[300px] mx-auto"
            >
              {/* Badge */}
              {product.isFeatured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  Featured
                </span>
              )}
              {product.isTrending && !product.isFeatured && (
                <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  Trending
                </span>
              )}

              {/* Product Image */}
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-[300px] object-cover"
                />
              )}

              {/* Product Content */}
              <div className="p-4">
                <p className="text-gray-400 text-xs">{product.productId}</p>
                <p className="text-lg font-bold">{product.name}</p>
                {reviewMap[product.productId] > 0 && renderStars(reviewMap[product.productId])}
                <p className="text-lg text-pink-500">
                  {product.price.toFixed(2)}{" "}
                  {product.price < product.labeledPrice && (
                    <span className="line-through text-gray-400 text-sm">
                      {product.labeledPrice.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && displayedProducts.length < products.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="bg-[#802549] text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
