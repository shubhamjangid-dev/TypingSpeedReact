import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Protected({ children, authentication }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const loggedIn = useSelector(state => state.userData.isUserLoggedIn);

  useEffect(() => {
    if (authentication && loggedIn !== authentication) {
      navigate("/login");
    } else if (!authentication && loggedIn !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [loggedIn, navigate, authentication]);
  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
