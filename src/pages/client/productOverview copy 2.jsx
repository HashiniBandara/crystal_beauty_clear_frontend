import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import getCart, { addToCart } from "../../utils/cart";

export default function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/products");

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("loading");
  const token = localStorage.getItem("token");
  const isAdmin =
    token && JSON.parse(atob(token.split(".")[1])).role === "admin"; // basic decode

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
  if (status === "error") return <div>Product Not Found</div>;

  return (
    <div className="w-full h-full px-4 py-6 lg:px-20 lg:py-12">
      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <ImageSlider images={product.images} />
        </div>
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4">
            {product.name} |{" "}
            <span className="font-normal">{product.altName.join(" | ")}</span>
          </h1>
          <div className="mb-4 flex items-center gap-4">
            <span className="text-2xl">LKR {product.price.toFixed(2)}</span>
            {product.labeledPrice > product.price && (
              <span className="text-xl line-through text-gray-500">
                LKR {product.labeledPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="flex gap-4 mb-6">
            <button
              className="px-6 py-3 bg-pink-800 text-white rounded hover:bg-white hover:text-pink-800 border border-pink-800"
              onClick={() => {
                addToCart(product, 1);
                toast.success("Added to cart");
              }}
            >
              Add to cart
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
              className="px-6 py-3 bg-pink-800 text-white rounded hover:bg-white hover:text-pink-800 border border-pink-800"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

     

{/* Reviews Section */}
<div className="mt-16">
  <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Reviews</h2>

  {reviews.length === 0 ? (
    <p className="text-gray-500 text-center italic">No reviews yet. Be the first to review!</p>
  ) : (
    <div className="space-y-6">
      {reviews.map(r => (
        <div key={r.reviewId} className="bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold uppercase">
                  {r.userName?.[0] || "U"}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{r.userName}</div>
                  <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>

            {isAdmin && (
              <button
                onClick={() => toggleBlock(r.reviewId, !r.isBlocked)}
                className={`text-sm px-3 py-1 rounded ${
                  r.isBlocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
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
<div className="mt-12 bg-white border rounded-lg shadow-md p-6">
  <h3 className="text-2xl font-bold mb-4 text-gray-800">Write a Review</h3>

  {token ? (
    <>
      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Your Name</label>
          <input
            type="text"
            value={JSON.parse(atob(token.split('.')[1])).firstName + " " + JSON.parse(atob(token.split('.')[1])).lastName}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email (private)</label>
          <input
            type="email"
            value={JSON.parse(atob(token.split('.')[1])).email}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 italic mb-4">
        Your email will <strong>not</strong> be shown publicly. It's only used for verification.
      </p>

      {/* Rating Selector */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-gray-700">Your Rating:</div>
        <div className="flex gap-1 text-xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`transition ${
                rating >= n ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Comment Box */}
      <textarea
        className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
        rows={4}
        placeholder="Share your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Submit Button */}
      <button
        className="bg-pink-800 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded transition"
        onClick={submitReview}
      >
        Submit Review
      </button>
    </>
  ) : (
    <div className="text-center">
      <p className="text-gray-600 text-lg mb-4">You must be logged in to post a review.</p>
      <button
        onClick={() => navigate("/login")}
        className="bg-pink-800 hover:bg-pink-700 text-white px-5 py-2 rounded transition"
      >
        Login to Write a Review
      </button>
    </div>
  )}
</div>

</div>



    </div>
  );
}
