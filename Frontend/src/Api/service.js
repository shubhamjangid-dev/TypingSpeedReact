const allLevels = async function () {
  return await fetch("http://localhost:4500/api/v1/levels/getAllLevels", {
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
  return await fetch("http://localhost:4500/api/v1/levels/getLevelContent", {
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
  return await fetch("http://localhost:4500/api/v1/score/submit", {
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
  return await fetch("http://localhost:4500/api/v1/users/login", {
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
  return await fetch("http://localhost:4500/api/v1/users/register", {
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
  return await fetch("http://localhost:4500/api/v1/users/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      password,
    }),
  }).catch(error => console.error(error));
};

export { allLevels, getLevelContent, submitResult, loginService, registerService, logoutService };
