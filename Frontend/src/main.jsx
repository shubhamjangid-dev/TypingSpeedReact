import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import LevelBar from "./Pages/LevelBar.jsx";
import Game from "./Pages/Game.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Profile from "./Pages/Profile.jsx";
import RoomSelection from "./gameSocket/RoomSelection.jsx";
import LiveGame from "./gameSocket/LiveGame.jsx";

// socket io
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_HOST_URL);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/level",
        element: (
          <AuthLayout authentication={true}>
            <LevelBar />
          </AuthLayout>
        ),
      },
      {
        path: "/level/:levelNo",
        element: (
          <AuthLayout authentication={true}>
            <Game />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/live",
        element: (
          <AuthLayout authentication={true}>
            <RoomSelection socket={socket} />
          </AuthLayout>
        ),
      },
      {
        path: "/live/:roomId",
        element: (
          <AuthLayout authentication={true}>
            <LiveGame socket={socket} />
          </AuthLayout>
        ),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
