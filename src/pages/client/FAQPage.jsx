import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const productFaqs = [
  {
    question: "Are your products safe for sensitive skin?",
    answer: "Yes, our formulas are dermatologically tested and designed to be gentle on all skin types.",
  },
  {
    question: "Do your products contain parabens or sulfates?",
    answer: "No, all our products are free from parabens, sulfates, and harsh chemicals.",
  },
  {
    question: "Are your ingredients organic?",
    answer: "We use high-quality organic and plant-based ingredients in most of our formulations.",
  },
  {
    question: "How should I store the products?",
    answer: "Store in a cool, dry place away from direct sunlight for maximum shelf life.",
  },
  {
    question: "Can I use these products daily?",
    answer: "Yes! Our skincare and beauty items are designed for safe daily use.",
  },
  {
    question: "Do you test on animals?",
    answer: "Never. All our products are 100% cruelty-free and not tested on animals.",
  },
  {
    question: "Are the products vegan?",
    answer: "Most of our items are vegan. Check the product page for specific details.",
  },
  {
    question: "Will these products clog pores?",
    answer: "No, they are non-comedogenic and formulated to allow your skin to breathe.",
  },
  {
    question: "Can I mix different products together?",
    answer: "Yes! Our collection is designed to work well when layered or combined.",
  },
  {
    question: "What is the shelf life of your products?",
    answer: "Typically 12–18 months after opening. Check the label for exact details.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#fff5f8]  text-[#802549] px-4 py-16 sm:px-10 mt-10 font-sans">
      <h1 className="text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {productFaqs.map((faq, idx) => (
          <div
            key={idx}
            className="border rounded-xl shadow-sm overflow-hidden transition"
          >
            <button
              onClick={() => toggle(idx)}
              className="flex justify-between items-center w-full px-6 py-4 text-left font-semibold text-lg focus:outline-none"
            >
              {faq.question}
              <FaChevronDown
                className={`transform transition duration-300 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-600 bg-white">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
