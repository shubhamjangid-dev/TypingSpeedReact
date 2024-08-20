import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerService } from "../Api/service";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/userSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    registerService(fullName, userEmail, userName, password)
      .then(response => response.json())
      .then(response => {
        console.log(response);

        if (response.success) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          dispatch(setUserData(response.data.user));
          navigate("/level");
        } else {
          setError(response.message);
          console.log("res", response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="w-full min-h-screen align-middle">
      <div className="w-full h-full px-10 py-20">
        <div className="max-w-sm px-2 py-4 flex flex-col border-b-[1px] border-black">
          <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
          <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              login
            </Link>
          </p>
          {/* {error && <p className="text-red-600 mt-8 text-center">{error}</p>} */}
          <input
            className="w-full h-10 px-2 my-2 rounded-full border-[1px] border-black"
            type="text"
            placeholder="fullname"
            value={fullName}
            onChange={e => {
              setFullName(e.target.value);
            }}
          />
          <input
            className="w-full h-10 px-2 my-2 rounded-full border-[1px] border-black"
            type="text"
            placeholder="email"
            value={userEmail}
            onChange={e => {
              setUserEmail(e.target.value);
            }}
          />
          <input
            className="w-full h-10 px-2 my-2 rounded-full border-[1px] border-black"
            type="text"
            placeholder="username"
            value={userName}
            onChange={e => {
              setUserName(e.target.value);
            }}
          />
          <input
            className="w-full h-10 px-2 my-2 rounded-full border-[1px] border-black"
            type="password"
            placeholder="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="w-full bg-black text-white h-10 px-2 my-2 rounded-full"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
        <div className="max-w-sm text-sm text-red-500 py-2">{error}</div>
      </div>
    </div>
  );
}

export default Register;
