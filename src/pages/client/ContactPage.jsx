import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-[#fff5f8] text-[#802549] px-4 py-16 sm:px-10 mt-10 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Contact Info */}
      <div className="grid gap-6">
  {[
    {
      icon: <FaPhoneAlt className="text-xl text-[#802549]" />,
      title: "Phone",
      detail: "+94 77 123 4567",
    },
    {
      icon: <FaEnvelope className="text-xl text-[#802549]" />,
      title: "Email",
      detail: "support@cristalbeauty.com",
    },
    {
      icon: <FaMapMarkerAlt className="text-xl text-[#802549]" />,
      title: "Address",
      detail: "123 Beauty Ave, Colombo, Sri Lanka",
    },
  ].map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-4 bg-[#fff5f8] hover:shadow-md transition rounded-xl p-5 border"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100">
        {item.icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold">{item.title}</h4>
        <p className="text-sm text-gray-700">{item.detail}</p>
      </div>
    </div>
  ))}
</div>


        {/* Contact Form */}
        <form className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-xl focus:outline-pink-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-xl focus:outline-pink-400"
            required
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-3 border rounded-xl focus:outline-pink-400"
            required
          />
          <button
            type="submit"
            className="bg-[#802549] text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
