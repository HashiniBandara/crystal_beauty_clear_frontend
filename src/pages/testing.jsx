import { useState } from "react";

export default function Testing() {
  const [number, setNumber] = useState(0);
  const [status, setStatus] = useState("Pending");

  function increment() {
    let newValue = number + 1;
    setNumber(newValue);
  }

  function decrement() {
    let newValue = number - 1;
    setNumber(newValue);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <span className="text-3xl text-bold">{number}</span>

      <div className="w-full flex justify-center items-center">
        <button
          onClick={increment}
          className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
        >
          {" "}
          +{" "}
        </button>
        <button
          onClick={decrement}
          className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
        >
          -{" "}
        </button>
      </div>

      <span className="text-3xl text-bold">{status}</span>

      <div className="w-full flex justify-center items-center">
        <button
          onClick={() => setStatus("Passed")}
          className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
        >
          Pass
        </button>
        <button
          onClick={() => setStatus("Failed")}
          className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
        >
          Fail
        </button>
      </div>
    </div>
  );
}
