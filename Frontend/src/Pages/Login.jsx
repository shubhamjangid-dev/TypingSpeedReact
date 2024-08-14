import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loginService } from "../Api/service";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userData.userData);
  console.log(user);

  useEffect(() => {
    dispatch(setUserData(user));
  }, [user]);
  const handleSubmit = () => {
    loginService(userName, password)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          user == response.data.user;
          navigate("/level");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-full min-h-screen align-middle">
      <div className="w-full h-full px-10 py-20">
        <div className="max-w-sm px-2 py-4 flex flex-col border-b-[1px] border-black">
          <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
          <p className="mt-2 text-center text-base text-black/60">
            Don&apos;t have any account?&nbsp;
            <Link
              to="/register"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>
          {/* {error && <p className="text-red-600 mt-8 text-center">{error}</p>} */}
          <input
            className="w-full h-10 px-2 my-2 rounded-full border-[1px] border-black"
            type="text"
            placeholder="username or email"
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
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
