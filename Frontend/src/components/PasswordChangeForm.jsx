import React, { useState } from "react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { changeCurentPassword } from "../Api/service";
function PasswordChangeForm() {
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset } = useForm();
  const changePassword = data => {
    console.log("change", data);

    if (data.newPassword == data.confirmPassword) {
      changeCurentPassword(data)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.success) {
            reset();
            alert("Password changed Successfully !");
          } else {
            setMessage(result.errormessage);
          }
        });
    } else {
      // password not same
      setMessage("New Password must be same");
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold text-left px-1 py-2">Change Password</h1>
      <form
        onSubmit={handleSubmit(changePassword)}
        onChange={() => {
          setMessage("");
        }}
      >
        <div className="w-full  bg-white rounded-lg flex border-[1px] border-black/30">
          <div className="w-full flex flex-col m-2 sm:m-5 text-left text-[14px] sm:text-[16px]">
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[110px] sm:w-[120px]">Old Password:</h1>
              <input
                type="password"
                className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                defaultValue={""}
                {...register("oldPassword", { required: true })}
              />
            </div>
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[110px] sm:w-[120px]">New Password:</h1>
              <input
                type="password"
                className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                defaultValue={""}
                {...register("newPassword", { required: true })}
              />
            </div>
            <div className="flex m-2 sm:m-3">
              <h1 className="w-[110px] sm:w-[120px]">New Password:</h1>
              <input
                type="password"
                className="bg-transparent outline-none px-2 rounded-sm border-[1px] border-gray-300"
                defaultValue={""}
                {...register("confirmPassword", { required: true })}
              />
            </div>
            {message && <div className="flex mx-2 sm:mx-3 -my-2 text-sm text-red-500">{message}</div>}
          </div>
          <div className="w-[10%] flex justify-end pr-2 pt-2">
            <button
              type="submit"
              className="w-4 h-4 sm:w-6 sm:h-6"
            >
              <Save className="w-full h-full" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default PasswordChangeForm;
