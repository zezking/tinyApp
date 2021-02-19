const bcrypt = require("bcrypt");
const checkEmail = (obj, str) => {
  for (i in obj) {
    if (obj[i].email === str) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = (obj, email) => {
  for (let i in obj) {
    if (obj[i].email === email) {
      return i;
    }
  }
  return undefined;
};

const urlsForUser = (obj, userID) => {
  let newObj = {};
  for (i in obj) {
    if (obj[i].userID === userID) {
      newObj[i] = obj[i];
    }
  }
  return newObj;
};

module.exports = { checkEmail, getUserByEmail, urlsForUser };
