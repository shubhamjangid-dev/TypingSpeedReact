import { useState } from "react";
import Game from "./Pages/Game";
import "./App.css";
import LevelBar from "./Pages/LevelBar";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-full min-h-screen bg-white">
        <nav className="w-full flex justify-between text-xl p-1 bg-black text-white ">
          <div>TypingTest</div>
          <div>User</div>
        </nav>
        <Outlet />
      </div>
    </>
  );
}

export default App;
