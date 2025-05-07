import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductOverview() {
  const params = useParams();
  console.log(params.id);
  if (params.id == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");//other values: loaded, error

  return (
    <div className="w-full h-screen bg-gray-200 flex p-2">ProductOverview</div>
  );
}
