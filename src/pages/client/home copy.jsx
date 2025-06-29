import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function HomePageDesign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://via.placeholder.com/600x400",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full font-sans">
      {/* Hero Carousel */}
      <div className="w-full h-[70vh] relative overflow-hidden">
        <img
          src={slides[currentSlide]}
          alt="Banner"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-800">
            Enhance Your Beauty Naturally
          </h1>
          <p className="text-lg md:text-xl mb-6 text-white">
            Discover organic skincare & makeup crafted with love.
          </p>
          <Link
            to="/products"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Skincare", "Makeup", "Haircare"].map((category, i) => (
            <Link
              to={`/products?category=${category.toLowerCase()}`}
              key={i}
              className="bg-white border border-pink-100 shadow-md hover:shadow-xl transition rounded-xl overflow-hidden"
            >
              <img
                src={`/images/category-${i + 1}.jpg`}
                alt={category}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 text-center font-semibold text-lg text-pink-700">
                {category}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-12 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">
          Best Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((p) => (
            <div
              key={p}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition border border-pink-100"
            >
              <img
                src={`/images/product-${p}.jpg`}
                alt="Product"
                className="w-full h-60 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1 text-red-800">
                  Beauty Product {p}
                </h3>
                <div className="flex items-center text-yellow-400 mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>
                <p className="text-pink-600 font-bold">$19.99</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-pink-50 p-6 rounded-xl shadow-sm text-center">
              <p className="italic text-gray-700 mb-4">
                “Absolutely love these products! My skin feels refreshed and glowing.”
              </p>
              <h4 className="font-semibold text-red-800">Customer {i + 1}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-pink-100 py-12 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-8">Why Choose Cristal Beauty Clear?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-pink-700 mb-2">Natural Ingredients</h4>
            <p className="text-gray-700">Our products are made from 100% fruit-based natural extracts.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-pink-700 mb-2">Cruelty-Free</h4>
            <p className="text-gray-700">No animal testing – ever. Just beauty with a conscience.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-pink-700 mb-2">Skin-Loving Formulas</h4>
            <p className="text-gray-700">Gentle on all skin types. Radiance, hydration, and care in every bottle.</p>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="bg-white py-12 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-8">Featured Brands</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {["GlowUp", "NatureBloom", "BerryBliss"].map((brand, i) => (
            <div key={i} className="text-pink-700 font-semibold text-xl border rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition">
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pink-100 py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4 text-red-700">
          Get Exclusive Offers
        </h2>
        <p className="mb-6 text-gray-700">
          Sign up for our newsletter and be the first to know!
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l-full border-t border-b border-l border-gray-300 w-64 focus:outline-none"
          />
          <button className="bg-red-600 text-white px-5 py-3 rounded-r-full hover:bg-red-700">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer / Trust Badges */}
      <footer className="bg-red-900 text-white text-center py-8">
        <p className="text-sm">&copy; 2025 Cristal Beauty Clear. All rights reserved.</p>
      </footer>
    </div>
  );
}
