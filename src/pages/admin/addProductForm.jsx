import { Link } from "react-router-dom";

export default function AddProductForm() {
  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-600 m-[10px]">
          Add Product
        </h1>
        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Product Id"
        />

        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Product Name"
        />

        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Alternative Name"
        />

        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Price"
        />

        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Labeled Price"
        />

        <textarea
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Description"
        />

        <input
          className="w-[400px] h-[50px] border border-gray-400 rounded-xl text-center m-[5px]"
          type="text"
          placeholder="Stock"
        />

        <div className="w-[400px] h-[100px] flex justify-between items-center">
          <Link
            to="/admin/products"
            className="bg-red-500 text-white rounded-lg block w-[180px] text-center p-[10px]  hover:bg-red-600"
          >
            Cancel
          </Link>
          <button className="bg-green-500 text-white rounded-lg block w-[180px] text-center p-[10px]  hover:bg-green-600">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
