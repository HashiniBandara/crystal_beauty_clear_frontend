// import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload";

export default function Testing() {
  const [file, setFile] = useState(null);

  function handleUpload() {
    mediaUpload(file)
      .then((url) => {
        console.log(url);
        toast.success("File uploaded successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("File upload failed");
      });
  }

  // const supabase=createClient("https://idaerdhzipvnpcwbzfft.supabase.co",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWVyZGh6aXB2bnBjd2J6ZmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI4MjcsImV4cCI6MjA2MTc3ODgyN30.APMMkdLB6Y_xhuWKRswJ7h0s31O9mLrNoRmqwDfZXeY");

  // function handleUpload() {
  //   const fileName = file.name;
  //   const newFileName = new Date().getTime() + fileName;

  //   supabase.storage
  //     .from("images")
  //     .upload(newFileName, file, {
  //       cacheControl: "3600",
  //       upsert: false,
  //     })
  //     .then(() => {
  //       toast.success("File uploaded successfully");
  //       const url = supabase.storage.from("images").getPublicUrl(newFileName)
  //         .data.publicUrl;
  //       console.log(url);
  //     })
  //     .catch(() => {
  //       toast.error("File upload failed");
  //     });
  // }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button
        onClick={handleUpload}
        className="w-[100px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
      >
        Upload
      </button>
    </div>
  );
}

// import { useState } from "react";

// export default function Testing() {
//   const [number, setNumber] = useState(0);
//   const [status, setStatus] = useState("Pending");

//   function increment() {
//     let newValue = number + 1;
//     setNumber(newValue);
//   }

//   function decrement() {
//     let newValue = number - 1;
//     setNumber(newValue);
//   }

//   return (
//     <div className="w-full h-screen flex flex-col justify-center items-center">
//       <span className="text-3xl text-bold">{number}</span>

//       <div className="w-full flex justify-center items-center">
//         <button
//           onClick={increment}
//           className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
//         >
//           {" "}
//           +{" "}
//         </button>
//         <button
//           onClick={decrement}
//           className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
//         >
//           -{" "}
//         </button>
//       </div>

//       <span className="text-3xl text-bold">{status}</span>

//       <div className="w-full flex justify-center items-center">
//         <button
//           onClick={() => setStatus("Passed")}
//           className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
//         >
//           Pass
//         </button>
//         <button
//           onClick={() => setStatus("Failed")}
//           className="w-[50px] h-[50px] bg-red-500 text-white p-2 rounded-xl cursor-pointer"
//         >
//           Fail
//         </button>
//       </div>
//     </div>
//   );
// }
