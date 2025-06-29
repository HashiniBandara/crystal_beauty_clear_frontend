import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function HomePageDesign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/images/banner1.jpg",
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
    <div className="w-full font-sans text-[#802549]">
      {/* Hero Carousel */}
      <div className="w-full h-[75vh] relative overflow-hidden">
        <img
          src={slides[currentSlide]}
          alt="Banner"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Enhance Your Beauty Naturally
          </h1>
          <p className="text-xl mb-6 max-w-2xl">
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

      {/* Featured Categories */}
      <section className="py-16 px-6 md:px-12 bg-[#fdf6f0]">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Skincare", "Makeup", "Haircare"].map((category, i) => (
            <Link
              to={`/products?category=${category.toLowerCase()}`}
              key={i}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`/images/category-${i + 1}.jpg`}
                alt={category}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 text-center font-semibold text-lg">
                {category}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((p) => (
            <div
              key={p}
              className="bg-white rounded-xl shadow hover:shadow-lg transition border"
            >
              <img
                src={`/images/product-${p}.jpg`}
                alt="Product"
                className="w-full h-60 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">Beauty Product {p}</h3>
                <div className="flex items-center text-yellow-400 mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>
                <p className="text-pink-700 font-bold">$19.99</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fdf6f0] py-16 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow text-center">
              <p className="italic text-gray-700 mb-4">
                “Absolutely love these products! My skin feels refreshed and glowing.”
              </p>
              <h4 className="font-semibold">Customer {i + 1}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-pink-50 py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose Cristal Beauty Clear?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-2">Natural Ingredients</h4>
            <p className="text-gray-700">Made from 100% fruit-based natural extracts.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Cruelty-Free</h4>
            <p className="text-gray-700">No animal testing – ever. Beauty with a conscience.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Skin-Loving Formulas</h4>
            <p className="text-gray-700">Gentle, hydrating care for every skin type.</p>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="bg-white py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-12">Featured Brands</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["GlowUp", "NatureBloom", "BerryBliss"].map((brand, i) => (
            <div
              key={i}
              className="text-[#802549] font-semibold text-lg border px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#802549] text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Get Exclusive Offers</h2>
        <p className="mb-6 text-lg">Sign up for our newsletter and be the first to know!</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l-full border-none w-64 focus:outline-none text-[#802549]"
          />
          <button className="bg-pink-600 text-white px-6 py-3 rounded-r-full hover:bg-pink-700 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#802549] text-white text-center py-6">
        <p className="text-sm">&copy; 2025 Cristal Beauty Clear. All rights reserved.</p>
      </footer>
    </div>
  );
}
