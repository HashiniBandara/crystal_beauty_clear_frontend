import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf,
} from "react-icons/fa";
import { PiPottedPlantDuotone, PiRabbitDuotone, PiSparkleDuotone } from "react-icons/pi";
import { GiLindenLeaf } from "react-icons/gi";

export default function HomePageDesign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleBest, setVisibleBest] = useState(8);
  const [visibleTrending, setVisibleTrending] = useState(8);
  const [visibleFeatured, setVisibleFeatured] = useState(8);

  const slides = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
    "/images/banner4.jpg",
    "/images/banner5.jpg",
    "/images/banner6.png",
    "/images/banner7.png",
  ];

  const scrollRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes, reviewRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/review/all`),
        ]);

        if (!catRes.ok || !prodRes.ok || !reviewRes.ok)
          throw new Error("Failed to fetch data");

        const [catData, prodData, reviewData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          reviewRes.json(),
        ]);

        setCategories(catData);
        setProducts(prodData);

        const map = {};
        prodData.forEach((p) => (map[p.productId] = []));
        reviewData.forEach((rev) => {
          if (!rev.isBlocked && map[rev.productId]) {
            map[rev.productId].push(rev);
          }
        });
        setReviewsMap(map);
        setAllReviews(reviewData.filter((r) => !r.isBlocked));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex justify-start gap-1">{stars}</div>;
  };

  const renderProductCard = (p) => {
    const reviews = reviewsMap[p.productId] || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
      <Link
        to={`/overview/${p.productId}`}
        key={p.productId}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden w-full max-w-[300px] mx-auto"
      >
        <img
          src={p.images?.[0] || "/images/default-product.jpg"}
          alt={p.name}
          className="w-full h-[300px] object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-gray-400">{p.productId}</p>
          <h3 className="text-lg font-semibold">{p.name}</h3>
          {reviews.length > 0 && renderStars(avgRating)}
          <p className="text-pink-700 font-bold text-lg">
            LKR {p.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {categories.find((c) => c.categoryId === p.categoryId)?.name ||
              "Unknown"}
          </p>
        </div>
      </Link>
    );
  };

  const trendingProducts = products.filter((p) => p.isTrending);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = [...products]
    .filter((p) => (reviewsMap[p.productId] || []).length > 0)
    .sort(
      (a, b) =>
        (reviewsMap[b.productId]?.length || 0) -
        (reviewsMap[a.productId]?.length || 0)
    );

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#802549] text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="font-sans text-[#802549] bg-[#fdf6f0]">
      {/* Hero */}
      <div className="relative w-full h-[75vh] overflow-hidden">
        <img
          src={slides[currentSlide]}
          alt="Banner"
          className="w-full h-full object-cover transition duration-700"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Enhance Your Beauty Naturally
          </h1>
          <p className="text-lg sm:text-xl mb-6 max-w-2xl">
            Discover organic skincare & makeup crafted with love.
          </p>
          <Link
            to="/products"
            className="bg-[#802549] hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-10 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.name}`}
              key={cat.categoryId}
              className="bg-[#fdf6f0] border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={cat.image || "/images/default-category.jpg"}
                alt={cat.name}
                className="w-full h-100 object-cover"
              />
              <div className="p-4 text-center font-semibold text-lg">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best / Trending / Featured Sections */}
      {[
        {
          title: "Best Sellers",
          items: bestSellers,
          visible: visibleBest,
          setter: setVisibleBest,
          bg: "white",
        },
        {
          title: "Trending Now",
          items: trendingProducts,
          visible: visibleTrending,
          setter: setVisibleTrending,
          bg: "#fdf6f0",
        },
        {
          title: "Featured Products",
          items: featuredProducts,
          visible: visibleFeatured,
          setter: setVisibleFeatured,
          bg: "white",
        },
      ].map(({ title, items, visible, setter, bg }) => (
        <section
          key={title}
          className={`py-16 px-4 sm:px-10`}
          style={{ backgroundColor: bg }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          {items.length === 0 ? (
            <p className="text-center text-gray-500">
              No {title.toLowerCase()} available.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {items.slice(0, visible).map(renderProductCard)}
              </div>
              {visible < items.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setter((prev) => prev + 4)}
                    className="bg-[#802549] text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ))}

      {/* Customer Reviews */}
      <section className="bg-[#fdf6f0] py-16 px-4 sm:px-10 text-center max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Customer Reviews</h2>
        {allReviews.length === 0 ? (
          <p className="text-gray-500">No reviews available yet.</p>
        ) : (
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth px-10 scrollbar-hide"
              style={{ scrollBehavior: "smooth", overflow: "hidden" }}
            >
              {allReviews.slice(0, 20).map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white p-6 rounded-xl shadow flex-shrink-0 w-82 flex flex-col  h-[250px]"
                >
                  <div className="flex flex-col items-center mt-4">
                    <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold uppercase text-lg">
                      {review.userName?.[0] || "U"}
                    </div>
                    <h4 className="font-semibold truncate">
                      {review.userName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-center">{renderStars(review.rating)}</p>
                    <p className="italic justify-between text-gray-700 mb-4 line-clamp-3 min-h-[60px]">
                      “{review.comment}”
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </section>


      {/* Benefits */}
      <section className="bg-pink-50 py-20 px-4 sm:px-10 text-center">
        <h2 className="text-3xl font-bold mb-12">
          Why Choose Cristal Beauty Clear?
        </h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Benefit 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <PiPottedPlantDuotone className=" text-5xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#802549]">
                Natural Ingredients
              </h4>
              <p className="text-gray-600 max-w-xs">
                Crafted with carefully selected natural ingredients to nourish and protect your skin.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
          <PiRabbitDuotone className=" text-5xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#802549]">
                Cruelty-Free
              </h4>
              <p className="text-gray-600 max-w-xs">
                 Absolutely cruelty-free - because compassion is always in style.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
             <PiSparkleDuotone className=" text-5xl mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#802549]">
                Skin-Loving Formulas
              </h4>
              <p className="text-gray-600 max-w-xs">
                Gentle, hydrating care for every skin type and tone.
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
