import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { logoutService, updateUserDetails, changeCurentPassword, getUserRank, deleteAccount } from "../Api/service";
import { setUserData } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

import { Trash2, Gauge, TicketCheck, ShieldCheck, Trophy } from "lucide-react";

import Congratulations from "../assets/Congratulations.jpg";
import { useNavigate } from "react-router-dom";
import UserDetailsForm from "../components/UserDetailsForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.userData.userData);

  const performLogOut = () => {
    logoutService()
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(setUserData(null));
        }
      })
      .finally(() => {
        navigate("/login");
      });
  };

  const [checkDelete, setCheckDelete] = useState(false);

  const performDeleteAccount = () => {
    deleteAccount()
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(setUserData(null));
        }
      })
      .finally(() => {
        navigate("/login");
      });
  };
  const [rank, setRank] = useState(0);

  useEffect(() => {
    getUserRank()
      .then(response => response.json())
      .then(result => setRank(1 + result));
  }, []);

  return (
    <div className="w-full min-h-screen pb-32 px-[5%] bg-blue-200">
      <div className="max-w-screen-lg m-auto">
        <div className="flex justify-between px-1 py-2 sticky top-11 bg-blue-200">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-md flex"
            onClick={performLogOut}
          >
            <LogOut
              strokeWidth={1.5}
              className="mr-1 cursor-pointer"
            />{" "}
            Logout
          </button>{" "}
        </div>

        <div className="w-full flex md:flex-row flex-col">
          <div className="w-full md:w-1/3 md:mr-1 my-1 bg-white rounded-lg">
            <div className="w-full flex flex-col justify-center py-4 ">
              <img
                src={Congratulations}
                className="h-52 w-52 rounded-full m-auto border-2 border-gray-400"
              />
              <div className="text-2xl pt-2">{user.fullname}</div>
            </div>
          </div>
          <div className="w-full md:w-2/3 md:ml-1 my-1 bg-white rounded-lg flex justify-center items-center p-2 sm:p-4 text-left text-gray-700">
            <div className="w-full text-xl grid grid-cols-2 gap-2 sm:gap-4">
              <div className="justify-between bg-black/5 rounded-md px-2 py-2 md:px-5 md:py-3 flex">
                <div>
                  <h1 className="text-sm md:text-lg">Rank </h1>
                  <h1 className="text-4xl md:text-5xl">{rank}</h1>
                </div>
                <div className="flex items-center">
                  <Trophy
                    size={50}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-2 py-2 md:px-5 md:py-3 flex">
                <div>
                  <h1 className="text-sm md:text-lg">Total Score</h1>
                  <h1 className="text-4xl md:text-5xl">{user.totalScore}</h1>
                </div>
                <div className="flex items-center">
                  <ShieldCheck
                    size={50}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-2 py-2 md:px-5 md:py-3 flex">
                <div>
                  <h1 className="text-sm md:text-xl">Top Speed</h1>
                  <h1 className="text-4xl md:text-5xl">{user.topSpeed}</h1>
                </div>
                <div className="flex items-center">
                  <Gauge
                    size={50}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-2 py-2 md:px-5 md:py-3 flex">
                <div>
                  <h1 className="text-sm md:text-xl">Level Passed</h1>
                  <h1 className="text-4xl md:text-5xl">{user.numberOfLevelsPassed}</h1>
                </div>
                <div className="flex items-center">
                  <TicketCheck
                    size={50}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <UserDetailsForm />
        <PasswordChangeForm />
        <h1 className="text-2xl font-semibold text-left px-1 py-2">Delete Account</h1>
        <div className="w-full bg-white rounded-lg">
          <div className="w-full flex flex-col p-5 text-left">
            <label className="pb-2">
              <input
                type="checkbox"
                className="w-4 mr-2"
                value={checkDelete}
                onChange={() => {
                  setCheckDelete(prev => !prev);
                }}
              />
              I agree to permanently delete my account and delete all associated data.
            </label>
            <div className="w-full flex justify-end">
              <button
                className={`${checkDelete ? "bg-red-500" : "bg-red-400"} text-white px-2 py-1 rounded-md flex`}
                disabled={!checkDelete}
                onClick={performDeleteAccount}
              >
                <Trash2
                  strokeWidth={1.5}
                  className="mr-1 cursor-pointer"
                  size={24}
                />{" "}
                Delete
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
