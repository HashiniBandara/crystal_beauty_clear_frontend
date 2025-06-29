import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import ProductCard from "../../components/product-card";
import getCart, { addToCart } from "../../utils/cart";

export default function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/products");

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("loading");
  const token = localStorage.getItem("token");
  const isAdmin =
    token && JSON.parse(atob(token.split(".")[1])).role === "admin";

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`)
        .then((res) => {
          setProduct(res.data.product);
          return axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/review/product/${id}`
          );
        })
        .then((res) => {
          setReviews(res.data);
          setStatus("loaded");
        })
        .catch(() => {
          toast.error("Failed loading product or reviews");
          setStatus("error");
        });
    }
  }, [status, id]);

  // Fetch related products by category
  useEffect(() => {
    if (product?.categoryId) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/product/category/${product.categoryId}`)
        .then((res) => {
          // exclude current product from related list
          const related = res.data.filter(p => p.productId !== product.productId);
          setRelatedProducts(related.slice(0, 4));
        })
        .catch(() => {
          // silently fail for related products
          setRelatedProducts([]);
        });
    }
  }, [product]);

  const submitReview = async () => {
    if (!token) {
      toast.error("Login to post review");
      return;
    }
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userName = decoded.firstName + " " + decoded.lastName;
    const userEmail = decoded.email;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/review`, {
        productId: id,
        userEmail,
        userName,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review submitted");
      setRating(5);
      setComment("");
      setStatus("loading");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Review Error:", error.response?.data || error.message);
    }
  };

  const toggleBlock = async (reviewId, block) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/review/block`,
        {
          reviewId,
          isBlocked: block,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Review ${block ? "blocked" : "unblocked"}`);
      setStatus("loading");
    } catch {
      toast.error("Failed to update review");
    }
  };

  if (status === "loading") return <Loader />;
  if (status === "error") return (
    <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-semibold">
      Product Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#802549] font-sans px-4 py-8 lg:px-20 lg:py-12">
      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-xl shadow-lg p-8">
        <div className="lg:w-1/2 rounded-lg overflow-hidden">
          <ImageSlider images={product.images} />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {product.name}{" "}
              <span className="text-xl font-light text-gray-500">
                | {product.altName.join(" | ")}
              </span>
            </h1>
            <div className="flex items-center gap-6 mb-6">
              <span className="text-3xl font-semibold">
                LKR {product.price.toFixed(2)}
              </span>
              {product.labeledPrice > product.price && (
                <span className="text-xl line-through text-gray-400">
                  LKR {product.labeledPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-8 flex gap-6">
            <button
              onClick={() => {
                addToCart(product, 1);
                toast.success("Added to cart");
              }}
              className="flex-1 px-6 py-3 rounded-full bg-pink-800 text-white font-semibold hover:bg-pink-700 transition-shadow shadow-md"
            >
              Add to Cart
            </button>
            <button
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    items: [
                      {
                        productId: product.productId,
                        name: product.name,
                        altName: product.altName,
                        price: product.price,
                        labeledPrice: product.labeledPrice,
                        images: product.images[0],
                        quantity: 1,
                      },
                    ],
                  },
                })
              }
              className="flex-1 px-6 py-3 rounded-full border border-pink-800 text-pink-800 font-semibold hover:bg-pink-800 hover:text-white transition-shadow shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-pink-800 pb-2">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center italic text-gray-500">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r.reviewId}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold uppercase text-lg">
                        {r.userName?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{r.userName}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 text-yellow-400 mb-3 text-xl">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{r.comment}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => toggleBlock(r.reviewId, !r.isBlocked)}
                      className={`text-sm px-4 py-2 rounded-full font-semibold ${
                        r.isBlocked
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      } transition-shadow shadow-sm`}
                    >
                      {r.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Review */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Write a Review
          </h3>

          {token ? (
            <>
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={
                      JSON.parse(atob(token.split(".")[1])).firstName +
                      " " +
                      JSON.parse(atob(token.split(".")[1])).lastName
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded px-4 py-3 bg-gray-100 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email (private)
                  </label>
                  <input
                    type="email"
                    value={JSON.parse(atob(token.split(".")[1])).email}
                    readOnly
                    className="w-full border border-gray-300 rounded px-4 py-3 bg-gray-100 text-gray-700"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 italic mb-6 text-center">
                Your email will <strong>not</strong> be shown publicly. It's only
                used for verification.
              </p>

              {/* Rating Selector */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-gray-700 font-semibold">Your Rating:</div>
                <div className="flex gap-2 text-3xl cursor-pointer select-none">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`transition ${
                        rating >= n ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(n)}
                      aria-label={`${n} Star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Box */}
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 mb-6"
                rows={5}
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {/* Submit Button */}
              <button
                className="block mx-auto bg-pink-800 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-shadow shadow-md"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-6">
                You must be logged in to post a review.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-pink-800 hover:bg-pink-700 text-white px-6 py-3 rounded-full transition-shadow shadow-md"
              >
                Login to Write a Review
              </button>
            </div>
          )}
        </div>
      </section>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 border-b-2 border-pink-800 pb-2 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((rp) => (
              <div
                key={rp.productId}
                className="relative shadow-md rounded-xl overflow-hidden bg-white transition hover:shadow-lg"
              >
                <ProductCard product={rp} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
