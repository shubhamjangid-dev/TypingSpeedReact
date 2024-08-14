import { useState } from "react";
import Game from "./Pages/Game";
import "./App.css";
import LevelBar from "./Pages/LevelBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "./components/Icon";

function App() {
  const navigate = useNavigate();
  const user = useSelector(state => state.userData.userData);

  return (
    <>
      <div className="w-full min-h-screen bg-white">
        <nav className="w-full flex justify-between text-lg p-2 bg-gray-800 text-white sticky top-0 z-10">
          <div className="flex">
            <div
              onClick={() => {
                navigate("/level");
              }}
            >
              <Icon name="menu" />
            </div>
            <h1
              className="ml-2"
              onClick={() => {
                navigate("/");
              }}
            >
              TypingTest
            </h1>
          </div>
          <div className="flex mr-1">
            <Icon name="user" />
            {user.fullname}
          </div>
        </nav>
        <Outlet />
      </div>
    </>
  );
}

export default App;
