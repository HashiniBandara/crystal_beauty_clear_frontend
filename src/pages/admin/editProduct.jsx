import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();
  //   console.log(locationData);
//   if (locationData.state == null) {
//     toast.error("Please select a product to edit");
//     window.location.href = "/admin/products";
//   }

  
  const [productId, setProductId] = useState(locationData.state.productId);
  const [name, setName] = useState(locationData.state.name);
//   const [altNames, setAltNames] = useState(locationData.state.altNames);
const [altName, setAltName] = useState(locationData.state.altName.join(","));
// const [altNames, setAltNames] = useState(locationData.state.altNames?.join(",") || "");
// const [altNames, setAltNames] = useState(() => {
//     const alt = locationData.state?.altNames;
//     if (Array.isArray(alt)) return alt.join(",");
//     if (typeof alt === "string") return alt;
//     return "";
//   });
//   const [altNames, setAltNames] = useState(locationData.state.altNames.join(","));
  const [price, setPrice] = useState(locationData.state.price);
  const [labeledPrice, setLabeledPrice] = useState(locationData.state.labeledPrice);
  const [description, setDescription] = useState(locationData.state.description);
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(locationData.state.stock);

  if (!locationData.state) {
    toast.error("Please select a product to edit");
    navigate("/admin/products");
    return null; // prevent component rendering
  }

  async function handleSubmit() {
    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      const promise = mediaUpload(images[i]);
      promisesArray[i] = promise;
    }
    // console.log(promisesArray);
    try {
      let result = await Promise.all(promisesArray);
      //console.log(result);

      if(images.length==0){
        result=locationData.state.images
      }

      const altNameInArray = altName.split(",");
    // const altNamesInArray = altNames.split(",").map(name => name.trim());

      const product = {
        productId: productId,
        name: name,
        altName: altNameInArray,
        price: price,
        labeledPrice: labeledPrice,
        description: description,
        stock: stock,
        images: result,
       
      };

      const token = localStorage.getItem("token");
      console.log(token);

      //console.log(product);

      await axios.put(
        // import.meta.env.VITE_BACKEND_URL + "/api/product"+productId,
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }

    toast.success("Form Submitted successfully");
  }

  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-600 m-[10px]">
          Edit Product
        </h1>
        <input
        disabled
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Product Id"
        />

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Product Name"
        />

        <input
          value={altName}
          onChange={(e) => {
            setAltName(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Alternative Name"
        />

        <input
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="number"
          placeholder="Price"
        />

        <input
          value={labeledPrice}
          onChange={(e) => {
            setLabeledPrice(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="number"
          placeholder="Labeled Price"
        />

        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Description"
        />

        <input
          type="file"
          onChange={(e) => {
            setImages(e.target.files);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          multiple
          placeholder="Product Images"
        />

        <input
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
          }}
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="number"
          placeholder="Stock"
        />

        <div className="w-[400px] h-[100px] flex justify-between items-center">
          <Link
            to="/admin/products"
            className="bg-red-500 text-white rounded-lg block w-[180px] text-center p-[10px]  hover:bg-red-600"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white rounded-lg block w-[180px] text-center p-[10px]  hover:bg-green-600"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}
