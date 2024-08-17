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
    <>
      <div className="w-full min-h-screen text-left px-10 bg-blue-200">
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
    </>
  );
}

export default Home;
