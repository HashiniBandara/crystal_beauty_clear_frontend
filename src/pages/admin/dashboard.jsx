import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxes,
  FaShoppingBag,
  FaComments,
  FaWarehouse,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const cards = [
    {
      label: "Users",
      count: stats.users,
      icon: <FaUsers className="text-white text-3xl" />,
      color: "bg-[#fca3b9]",
    },
    {
      label: "Products",
      count: stats.products,
      icon: <FaWarehouse className="text-white text-3xl" />,
      color: "bg-[#f39f6e]",
    },
    {
      label: "Categories",
      count: stats.categories,
      icon: <FaBoxes className="text-white text-3xl" />,
      color: "bg-[#f7d383]",
    },
    {
      label: "Orders",
      count: stats.orders,
      icon: <FaShoppingBag className="text-white text-3xl" />,
      color: "bg-[#8cb2d2]",
    },
    {
      label: "Reviews",
      count: stats.reviews,
      icon: <FaStar className="text-white text-3xl" />,
      color: "bg-[#aed9d1]",
    },
    {
      label: "Contact Queries",
      count: stats.contacts,
      icon: <FaComments className="text-white text-3xl" />,
      color: "bg-[#d3e878]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 p-5 rounded-lg shadow-lg text-white ${card.color}`}
        >
          <div className="p-3 rounded-full bg-white/20">{card.icon}</div>
          <div>
            <p className="text-lg font-semibold">{card.label}</p>
            <p className="text-2xl font-bold">{card.count ?? "0"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
