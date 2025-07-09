import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import { FaStar, FaRegStar, FaStarHalfAlt, FaSearch } from "react-icons/fa";

export default function MakeupPage() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  const categoryId = "C0002";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product`
      );
      let filtered = res.data.filter((p) => p.categoryId === categoryId);

      if (search) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      switch (sortOption) {
        case "priceLowHigh":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "priceHighLow":
          filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
      }

      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching makeup products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productList) => {
    const reviewResults = await Promise.all(
      productList.map((product) =>
        axios
          .get(
            `${import.meta.env.VITE_BACKEND_URL}/api/review/product/${
              product.productId
            }`
          )
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

  useEffect(() => {
    fetchProducts();
  }, [search, sortOption]);

  useEffect(() => {
    const limited = products.slice(0, visibleCount);
    setVisibleProducts(limited);
    fetchProductReviews(limited);
  }, [products, visibleCount]);

  const handleReset = () => {
    setSearch("");
    setSortOption("latest");
    setVisibleCount(8);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex gap-1 mt-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#802549] pt-28 pb-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Discover Makeup Products
      </h1>

      {/* Search and Sort UI */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <div className="flex items-center border border-gray-300 rounded-full px-4 w-full max-w-md bg-white shadow-sm">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search makeup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
            className="w-full p-2 outline-none bg-transparent"
          />
        </div>
        <button
          className="bg-[#802549] text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
          onClick={fetchProducts}
        >
          Search
        </button>
        <button
          className="bg-gray-200 text-[#802549] px-4 py-2 rounded-full hover:bg-gray-300"
          onClick={handleReset}
        >
          Reset
        </button>
        {/* <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-full text-[#802549] bg-white shadow-sm"
        >
          <option value="latest">Sort by: Latest</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select> */}

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-pink-300 px-4 py-2 rounded-xl text-[#802549] bg-[#fff0f5] shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        >
          <option value="latest">Sort by: Latest</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-gray-500">No makeup products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <Link
                to={`/overview/${product.productId}`}
                key={product.productId}
                className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition w-full max-w-[300px] mx-auto"
              >
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

                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-[300px] object-cover"
                  />
                )}

                <div className="p-4">
                  <p className="text-gray-400 text-xs">{product.productId}</p>
                  <p className="text-lg font-bold">{product.name}</p>
                  {reviewMap[product.productId] > 0 &&
                    renderStars(reviewMap[product.productId])}
                  <p className="text-lg text-pink-500">
                    {product.price.toFixed(2)}{" "}
                    {product.price < product.labeledPrice && (
                      <span className="line-through text-gray-400 text-sm ml-2">
                        {product.labeledPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {visibleProducts.length < products.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="bg-[#802549] text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
