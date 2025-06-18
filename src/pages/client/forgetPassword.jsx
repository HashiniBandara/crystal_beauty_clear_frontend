export default function ForgetPassword() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1>Forget Password</h1>
      <div className="w-full h-full flex justify-center items-center">
        {/* enter your email */}
        <div className="w-[500px] h-[400px] flex flex-col justify-center items-center bg-gray-100 rounded-lg shadow-2xl">
          <div className="w-full h-[100px] flex justify-center items-center">
            <h1 className="text-3xl text-bold">Enter your email</h1>
          </div>
          <div className="w-full h-[100px] flex justify-center items-center">
            <input
              className="w-[300px] h-[50px] bg-gray-200 rounded-lg p-2"
              placeholder="Email"
            />
          </div>
          <div className="w-full h-[100px] flex justify-center items-center">
            <button className="w-[300px] h-[50px] bg-blue-500 text-white rounded-lg cursor-pointer">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
