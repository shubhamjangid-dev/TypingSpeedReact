import React, { useEffect } from "react";
import { refreshAccessToken } from "../Api/service";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken && refreshToken) {
      refreshAccessToken(refreshToken)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("refreshToken", result.data.refreshToken);
            dispatch(setUserData(result.data.user));
          }
        });
    }
  }, []);
  return (
    <div className="w-full min-h-screen overflow-clip">
      <div className="w-full h-[70vh] text-left px-10">
        <h1 className="text-7xl font-bold text-gray-800 pt-10">Learn Typing Easily</h1>
        <button
          className="bg-blue-950 text-white text-4xl font-thin rounded-md px-10 py-2 mt-10"
          onClick={() => {
            navigate("/level");
          }}
        >
          Get Started
        </button>
      </div>
      <div className="w-full bg-blue-950 rounded-t-[50%] scale-150 p-10 text-4xl">
        <h1 className=" text-white/80 mt-7 mb-4">Play 1 V 1</h1>
        <button
          className="bg-white font-light rounded-md px-10 py-2 mt-10 scale-75"
          onClick={() => {
            navigate("/live");
          }}
        >
          Play
        </button>
      </div>
      <div className="w-full bg-blue-950 h-64"></div>
    </div>
  );
}

export default Home;
