import { FaHeart, FaLeaf, FaHandsHelping } from "react-icons/fa";
import { PiSparkleDuotone, PiPlantDuotone } from "react-icons/pi";

export default function AboutPage() {
  return (
    <div className="bg-[#fff5f8] text-[#802549] px-4 py-16 sm:px-10 font-sans">
      <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
      <p className="max-w-3xl mx-auto text-center text-gray-600 mb-12">
        At <strong>Crystal Beauty Clear</strong>, we believe beauty should be
        pure, kind, and empowering. Our mission is to create high-quality,
        natural skincare and makeup products that make you look and feel your
        best without compromising your health or values.
      </p>

      {/* Our Story Section */}
      <section className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20 items-center">
        <img
          src="/our-story.png"
          alt="Our Story"
          className="w-full h-[300px] object-cover rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Crystal Beauty Clear was born from a passion for clean beauty and
            a frustration with toxic ingredients in mainstream cosmetics. We
            started with a small dream — to empower people with safe,
            eco-friendly, and cruelty-free skincare that works.
          </p>
          <p className="text-gray-700 mt-4">
            Every product is crafted with love, inspired by nature, and tested
            for real results.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our Core Values</h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              icon: <PiPlantDuotone className="text-4xl" />,
              title: "Natural Ingredients",
              desc: "We use plant-based, skin-safe ingredients that are gentle yet effective.",
            },
            {
              icon: <FaHandsHelping className="text-3xl" />,
              title: "Ethical & Cruelty-Free",
              desc: "We never test on animals compassion is at the heart of what we do.",
            },
            {
              icon: <PiSparkleDuotone className="text-4xl" />,
              title: "Empowering Beauty",
              desc: "We believe beauty is for everyone. Our products are designed to enhance, not mask.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center"
            >
              <div className="bg-pink-100 rounded-full w-14 h-14 flex items-center justify-center mb-4 text-[#802549]">
                {item.icon}
              </div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white rounded-2xl shadow-md max-w-4xl mx-auto py-12 px-6 sm:px-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Clean Beauty Movement</h2>
        <p className="text-gray-700 mb-6">
          Be part of our growing community that chooses wellness, kindness, and
          confidence every day. Explore our collections, read real reviews, and
          feel the difference of Crystal Beauty Clear.
        </p>
        <a
          href="/products"
          className="inline-block bg-[#802549] hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Explore Our Products
        </a>
      </section>
    </div>
  );
}
