import React from "react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { changeCurentPassword } from "../Api/service";
function PasswordChangeForm() {
  const { register, handleSubmit } = useForm();
  const changePassword = data => {
    console.log("change", data);

    if (data.newPassword == data.confirmPassword) {
      changeCurentPassword(data)
        .then(response => response.json())
        .then(result => console.log(result));
    } else {
      // password not same
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold text-left px-1 py-2">Change Password</h1>
      <form onSubmit={handleSubmit(changePassword)}>
        <div className="w-full  bg-white rounded-lg flex">
          <div className="w-full flex flex-col m-2 sm:m-5 text-left text-[14px] sm:text-[16px]">
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[120px]">Old Password :</h1>
              <input
                type="password"
                className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                defaultValue={""}
                {...register("oldPassword", { required: true })}
              />
            </div>
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[120px]">New Password :</h1>
              <input
                type="password"
                className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                defaultValue={""}
                {...register("newPassword", { required: true })}
              />
            </div>
            <div className="flex m-2 sm:m-3">
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
    </>
  );
}

export default PasswordChangeForm;
