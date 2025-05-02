import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      const promise = mediaUpload(images[i]);
      promisesArray[i] = promise;
    }
    // console.log(promisesArray);
    try {
      const result = await Promise.all(promisesArray);
      //console.log(result);

      const altNamesInArray = altNames.split(",");
      const product = {
        productId: productId,
        name: name,
        altNames: altNamesInArray,
        price: price,
        labeledPrice: labeledPrice,
        description: description,
        stock: stock,
        images: result,
        // Images: [
        //   "https://picsum.photos/id/102/200/300",
        //   "https://picsum.photos/id/103/200/300",
        //   "https://picsum.photos/id/104/200/300",
        // ],
      };

      const token = localStorage.getItem("token");
      console.log(token);

      //console.log(product);

     await axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/product", product, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        toast.success("Product added successfully");
          navigate("/admin/products");

        // .then(() => {
        //   toast.success("Product added successfully");
        //   navigate("/admin/products");
        // })
        // .catch(() => {
        //   toast.error("Failed to add product");
        // });

    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }

    toast.success("Form Submitted successfully");
  }

  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-600 m-[10px]">
          Add Product
        </h1>
        <input
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
          value={altNames}
          onChange={(e) => {
            setAltNames(e.target.value);
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
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/*
Project url: https://idaerdhzipvnpcwbzfft.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWVyZGh6aXB2bnBjd2J6ZmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI4MjcsImV4cCI6MjA2MTc3ODgyN30.APMMkdLB6Y_xhuWKRswJ7h0s31O9mLrNoRmqwDfZXeY 
*/
