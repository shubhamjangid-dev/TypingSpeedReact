import { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { getCurrentUser } from "./Api/service";
import { setUserData } from "./store/userSlice";
import { useDispatch } from "react-redux";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getCurrentUser(accessToken)
        .then(response => response.json())
        .then(userData => {
          if (userData) dispatch(setUserData(userData.data));
          else dispatch(setUserData(null));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <>
      <Header />
      <Loader />
    </>
  ) : (
    <>
      <div className="w-full min-h-screen bg-white">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
