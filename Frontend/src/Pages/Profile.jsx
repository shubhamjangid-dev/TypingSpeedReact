import React from "react";
import { LogOut } from "lucide-react";
import { logoutService } from "../Api/service";
import { setUserData } from "../store/userSlice";
import { useDispatch } from "react-redux";
function Profile() {
  const dispatch = useDispatch();
  const performLogOut = () => {
    logoutService()
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(setUserData(null));
        }
      });
  };
  return (
    <div className="flex justify-center items-center">
      Profile
      <button
        className="bg-red-500 text-white px-2 py-1 rounded-md flex"
        onClick={performLogOut}
      >
        <LogOut
          strokeWidth={1.5}
          className="mr-1 cursor-pointer"
        />{" "}
        Logout
      </button>
    </div>
  );
}

export default Profile;
