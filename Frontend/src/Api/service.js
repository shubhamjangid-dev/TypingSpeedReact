const backend_host_url = import.meta.env.VITE_BACKEND_HOST_URL;

const allLevels = async function () {
  return await fetch(`${backend_host_url}/levels/getAllLevels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: localStorage.getItem("accessToken"),
    }),
  }).catch(error => console.error(error));
};

const getLevelContent = async function (levelId) {
  return await fetch(`${backend_host_url}/levels/getLevelContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: levelId,
    }),
  }).catch(error => console.error(error));
};

const submitResult = async function (levelId, score) {
  return await fetch(`${backend_host_url}/score/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      levelId,
      score,
      accessToken: localStorage.getItem("accessToken"),
    }),
  }).catch(error => console.error(error));
};

const loginService = async function (username, password) {
  return await fetch(`${backend_host_url}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).catch(error => console.error(error));
};
const registerService = async function (fullname, email, username, password) {
  return await fetch(`${backend_host_url}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullname,
      email,
      username,
      password,
    }),
  }).catch(error => console.error(error));
};
const logoutService = async function () {
  return await fetch(`${backend_host_url}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: localStorage.getItem("accessToken"),
    }),
  }).catch(error => console.error(error));
};

const getCurrentUser = async function (accessToken) {
  return await fetch(`${backend_host_url}/users/currentuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
    }),
  }).catch(error => console.error(error));
};

const refreshAccessToken = async function (refreshToken) {
  return await fetch(`${backend_host_url}/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  }).catch(error => console.error(error));
};

export { allLevels, getLevelContent, submitResult, loginService, registerService, logoutService, getCurrentUser, refreshAccessToken };
