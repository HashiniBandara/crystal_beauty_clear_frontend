import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/review/all`)
      .then((res) => res.json())
      .then((data) => {
        const unblocked = data.filter((r) => !r.isBlocked);
        setReviews(unblocked.reverse());
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load reviews.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[#802549] text-xl">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        {error}
      </div>
    );

  return (
    <div className="bg-[#fff5f8] text-[#802549] px-4 sm:px-10 py-16 font-sans min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">
        What Our Customers Are Saying
      </h1>
      <p className="text-center max-w-2xl mx-auto text-gray-600 mb-12">
        These reviews are shared by customers who purchased our products. You
        can also find product-specific reviews on each product’s overview page,
        right below the product details.
      </p>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold uppercase text-lg">
                    {review.userName?.[0] || "U"}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
                <p className="mt-4 text-gray-700 italic">“{review.comment}”</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
