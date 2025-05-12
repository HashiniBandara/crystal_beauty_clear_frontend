import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ProductOverview() {
  const params = useParams();
  console.log(params.id);
  if (params.id == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); //other values: loaded, error

  useEffect(() => {
    if (status == "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + params.id)
        .then((res) => {
          console.log(res.data);
          setProduct(res.data);
          setStatus("loaded");
        })
        .catch(() => {
          toast.error("Product is not available");
          setStatus("error");
        });
    }
  }, [status]);

  return (
    <div className="w-full h-full">
      {status == "loading" &&  <Loader />}
      {status == "loaded" && <div>Product Loaded</div>}
      {status == "error" && <div>Product Not Found</div>}
    </div>
  );
}
