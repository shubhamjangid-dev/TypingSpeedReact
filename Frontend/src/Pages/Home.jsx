import React, { useEffect } from "react";
import { refreshAccessToken } from "../Api/service";
function Home() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      refreshAccessToken()
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            localStorage.setItem("accessToken", result.data.accessToken);
            localStorage.setItem("refreshToken", result.data.refreshToken);
            dispatch(setUserData(result.data.user));
          }
        });
    }
  }, []);
  return <>home</>;
}

export default Home;
