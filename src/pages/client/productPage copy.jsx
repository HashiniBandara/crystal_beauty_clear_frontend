import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ProductCard from "../../components/product-card";

export default function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!productsLoaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product/")
        .then((res) => {
          console.log(res.data);
          setProductList(res.data);
          setProductsLoaded(true);
        });
    }
  }, [productsLoaded]);

function searchProducts(){
  if(search.length > 0){
    axios
    .get(import.meta.env.VITE_BACKEND_URL + "/api/product/search/" + search)
    .then((res) => {
      // console.log(res.data);
      setProductList(res.data.products);
      // setProductsLoaded(true);
    });
  }
}

  return (
    <div className="h-full w-full">
      {/* search bar and button */}
      <div className="w-full h-[100px] flex justify-center items-center mt-12">
        <input
          type="text"
          placeholder="Search for products"
          className="w-[400px] h-[50px] rounded-full border-2 border-gray-400 px-4"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="w-[100px] h-[50px] bg-blue-500 text-white rounded-full ml-4"
          onClick={() => {
            searchProducts();
           }}
        >
          Search
        </button>
        {/* reset button */}
        <button
          className="w-[100px] h-[50px] bg-red-500 text-white rounded-full ml-4"
          onClick={() => {
            setProductsLoaded(false);
          }}
        >
          Reset
        </button>
      </div>

      {productsLoaded ? (
        <div className="w-full h-full flex flex-wrap justify-center">
          {productList.map((product) => {
            return <ProductCard key={product.productId} product={product} />;
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
