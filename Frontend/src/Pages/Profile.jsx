import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { logoutService, updateUserDetails, changeCurentPassword, getUserRank, deleteAccount } from "../Api/service";
import { setUserData } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Pencil, Trash2, Save, Gauge, TicketCheck, ShieldCheck, Trophy } from "lucide-react";

import Congratulations from "../assets/Congratulations.jpg";
import { useNavigate } from "react-router-dom";
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.userData.userData);

  const [isUserDetailsEditable, setIsUserDetailsEditable] = useState(false);

  const { register, handleSubmit } = useForm();
  const updateDetail = data => {
    if (data.username != user.username || data.fullname != user.fullname) {
      updateUserDetails({ username: data.username, fullname: data.fullname })
        .then(response => response.json())
        .then(result => console.log(result));
    }
  };

  const changePassword = data => {
    if (data.newPassword == data.confirmPassword) {
      changeCurentPassword({ oldPassword: data.oldPassword, newPassword: data.newPassword, confirmPassword: data.confirmPassword })
        .then(response => response.json())
        .then(result => console.log(result));
    } else {
      // password not same
    }
  };

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
    <div className="w=full min-h-screen pb-32 bg-blue-200">
      <div className="max-w-screen-lg m-auto">
        <div className="flex justify-between px-3 py-2 sticky top-11 bg-blue-200">
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

        <div className="w-full flex ">
          <div className="w-1/3 m-1 bg-white rounded-lg">
            <div className="w-full flex flex-col justify-center py-4 ">
              <img
                src={Congratulations}
                className="h-52 w-52 rounded-full m-auto border-2 border-gray-400"
              />
              <div className="text-2xl pt-2">{user.fullname}</div>
            </div>
          </div>
          <div className="w-2/3 bg-white rounded-lg m-1 flex justify-center items-center px-4 text-left text-gray-700">
            <div className="w-full text-xl grid grid-cols-2 gap-4">
              <div className="justify-between bg-black/5 rounded-md px-5 py-3 flex">
                <div>
                  <h1 className="text-lg">Rank </h1>
                  <h1 className="text-5xl">{rank}</h1>
                </div>
                <div>
                  <Trophy
                    size={70}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-5 py-3 flex">
                <div>
                  <h1 className="text-lg">Total Score</h1>
                  <h1 className="text-5xl">{user.totalScore}</h1>
                </div>
                <div>
                  <ShieldCheck
                    size={70}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-5 py-3 flex">
                <div>
                  <h1 className="text-xl">Top Speed</h1>
                  <h1 className="text-5xl">{user.topSpeed}</h1>
                </div>
                <div>
                  <Gauge
                    size={70}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
              <div className="justify-between bg-black/5 rounded-md px-5 py-3 flex">
                <div>
                  <h1 className="text-xl">Level Passed</h1>
                  <h1 className="text-5xl">{user.numberOfLevelsPassed}</h1>
                </div>
                <div>
                  <TicketCheck
                    size={70}
                    strokeWidth={1}
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-left px-3 py-2">User Details</h1>
        <form onSubmit={handleSubmit(updateDetail)}>
          <div className="w-full  bg-white rounded-lg flex">
            <div className="w-full flex flex-col m-5 text-left">
              <div className="flex m-3">
                <h1 className="w-[120px]">Full Name :</h1>
                <input
                  type="text"
                  className={`${!isUserDetailsEditable ? "bg-transparent border-transparent" : " border-gray-300"} outline-none px-2 rounded-sm border-[1px]`}
                  defaultValue={user.fullname}
                  {...register("fullname", { required: true })}
                  readOnly={isUserDetailsEditable ? false : true}
                />
              </div>
              <div className="flex m-3">
                <h1 className="w-[120px]">Username :</h1>
                <input
                  type="text"
                  className={`${!isUserDetailsEditable ? "bg-transparent border-transparent" : " border-gray-300"} outline-none px-2 rounded-sm border-[1px]`}
                  defaultValue={user.username}
                  {...register("username", { required: true })}
                  readOnly={isUserDetailsEditable ? false : true}
                />
              </div>
              <div className="flex m-3">
                <h1 className="w-[120px]">Email :</h1>
                <input
                  type="text"
                  className="bg-transparent outline-none px-2 rounded-sm"
                  defaultValue={user.email}
                  {...register("email")}
                  readOnly
                />
              </div>
            </div>
            <div
              className="w-[10%] flex justify-end pr-2 pt-2"
              onClick={() => {
                setIsUserDetailsEditable(prev => !prev);
              }}
            >
              {!isUserDetailsEditable ? (
                <Pencil />
              ) : (
                <button
                  type="submit"
                  className="w-6 h-6"
                >
                  <Save />
                </button>
              )}
            </div>
          </div>
        </form>

        <h1 className="text-2xl font-semibold text-left px-3 py-2">Change Password</h1>
        <form onSubmit={handleSubmit(changePassword)}>
          <div className="w-full  bg-white rounded-lg flex">
            <div className="w-full flex flex-col m-5 text-left">
              <div className="flex m-3">
                <h1 className="w-[120px]">Old Password :</h1>
                <input
                  type="password"
                  className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                  defaultValue={""}
                  {...register("oldPassword", { required: true })}
                />
              </div>
              <div className="flex m-3">
                <h1 className="w-[120px]">New Password :</h1>
                <input
                  type="password"
                  className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                  defaultValue={""}
                  {...register("newPassword", { required: true })}
                />
              </div>
              <div className="flex m-3">
                <h1 className="w-[120px]">New Password :</h1>
                <input
                  type="password"
                  className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                  defaultValue={""}
                  {...register("confirmPassword", { required: true })}
                />
              </div>
            </div>
            <div className="w-[10%] flex justify-end pr-2 pt-2">
              <button
                type="submit"
                className="w-6 h-6"
              >
                <Save />
              </button>
            </div>
          </div>
        </form>

        <h1 className="text-2xl font-semibold text-left px-3 py-2">Delete Account</h1>
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
