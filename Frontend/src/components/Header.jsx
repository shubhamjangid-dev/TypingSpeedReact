import React from "react";
import Icon from "./Icon.jsx";
import { UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const navigate = useNavigate();
  const user = useSelector(state => state.userData.userData);
  const isLoggedIn = useSelector(state => state.userData.isUserLoggedIn);

  return (
    <nav className="w-full flex justify-between text-lg p-2 bg-black/90 text-white/90 sticky top-0 z-10">
      <div className="flex">
        <div
          onClick={() => {
            navigate("/level");
          }}
        >
          <Icon
            name="menu"
            className="cursor-pointer"
          />
        </div>
        <h1
          className="ml-2 font-semibold tracking-widest cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          TypingZone
        </h1>
      </div>
      {isLoggedIn ? (
        <div
          className="flex mr-1 text-md cursor-pointer"
          onClick={() => {
            navigate("/profile");
          }}
        >
          {/* <Icon name="user" /> */}
          {user?.fullname}
          <UserRound className="m-0.5" />
        </div>
      ) : (
        <div
          className="flex mr-1 text-md cursor-pointer"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </div>
      )}
    </nav>
  );
}

export default Header;
