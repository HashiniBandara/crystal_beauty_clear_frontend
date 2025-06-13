import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import getCart, { addToCart } from "../../utils/cart";

export default function ProductOverview() {
  const params = useParams();
  console.log(params.id);
  if (params.id == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); //other values: loaded, error
  const navigate = useNavigate();

  useEffect(() => {
    if (status == "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + params.id)
        .then((res) => {
          console.log(res.data);
          setProduct(res.data.product);
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
      {status == "loading" && <Loader />}
      {status == "loaded" && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[50%] h-full">
            <ImageSlider images={product.images} />
          </div>
          <div className="w-[50%] h-full p-[40px]">
            <h1 className="text-center text-3xl text-bold mb-[40px]">
              {product.name} {" |  "}
              <span className="text-center text-3xl font-semibold text-gray-500">
                {product.altName.join(" | ")}
              </span>
            </h1>

            <div className="w-full flex justify-center mb-[40px]">
              {product.labeledPrice > product.price ? (
                <>
                  <h2 className="mr-[20px] text-2xl">
                    LKR: {product.price.toFixed(2)}
                  </h2>
                  <h2 className="line-through text-2xl text-gray-500">
                    LKR: {product.labeledPrice.toFixed(2)}
                  </h2>
                </>
              ) : (
                <h2 className="mr-[20px] text-2xl">
                  LKR: {product.price.toFixed(2)}
                </h2>
              )}
            </div>
            <p className="text-center text-xl font-semibold text-gray-500 mb-[40px]">
              {product.description}
            </p>

            <div className="w-full flex justify-center mb-[40px]">
              <button
                className="w-[200px] h-[50px] cursor-pointer bg-pink-800 text-white rounded-xl border border-pink-800 hover:bg-white hover:text-pink-800"
                onClick={() => {
                  const updated = addToCart(product, 1);
                  console.log(updated);
                  console.log(getCart());
                  toast.success("Added to cart");
                }}
              >
                Add to cart
              </button>
              <button 
              onClick={() => navigate("/checkout", {state:{items:[
                {
                  productId:product.productId,
                  name:product.name,
                  altName:product.altName,
                  price:product.price,
                  labeledPrice:product.labeledPrice,
                  images:product.images[0],
                  quantity:1
                }
              ]}})} 
              className="w-[200px] h-[50px] cursor-pointer bg-pink-800 text-white rounded-xl ml-[40px] border border-pink-800 hover:bg-white hover:text-pink-800">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
      {status == "error" && <div>Product Not Found</div>}
    </div>
  );
}
