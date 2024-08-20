import React, { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUserDetails } from "../Api/service";
import { setUserData } from "../store/userSlice";

function UserDetailsForm() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userData.userData);
  const { register, handleSubmit } = useForm();

  const [isUserDetailsEditable, setIsUserDetailsEditable] = useState(false);

  const updateDetail = data => {
    console.log(data);

    console.log("", data.username != user.username || data.fullname != user.fullname);

    if (data.username != user.username || data.fullname != user.fullname) {
      updateUserDetails(data)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.success) {
            dispatch(setUserData(result.data));
          }
        });
    }

    setIsUserDetailsEditable(false);
  };
  return (
    <>
      <h1 className="text-2xl font-semibold text-left px-1 py-2">User Details</h1>
      <form onSubmit={handleSubmit(updateDetail)}>
        <div className="w-full  bg-white rounded-lg flex">
          <div className="w-full flex flex-col m-2 sm:m-5 text-left text-[14px] sm:text-[16px]">
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[120px]">Full Name :</h1>
              <input
                type="text"
                className={`${!isUserDetailsEditable ? "bg-transparent border-transparent" : " border-gray-300"} outline-none px-2 rounded-sm border-[1px]`}
                defaultValue={user.fullname}
                {...register("fullname", { required: true })}
                readOnly={isUserDetailsEditable ? false : true}
              />
            </div>
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[120px]">Username :</h1>
              <input
                type="text"
                className={`${!isUserDetailsEditable ? "bg-transparent border-transparent" : " border-gray-300"} outline-none px-2 rounded-sm border-[1px]`}
                defaultValue={user.username}
                {...register("username", { required: true })}
                readOnly={isUserDetailsEditable ? false : true}
              />
            </div>
            <div className="flex m-2 sm:m-3">
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
          <div className="w-[10%] flex justify-end pr-2 pt-2">
            {!isUserDetailsEditable ? (
              <Pencil
                onClick={() => {
                  setIsUserDetailsEditable(true);
                }}
              />
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
      </form>{" "}
    </>
  );
}

export default UserDetailsForm;
