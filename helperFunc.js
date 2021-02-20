//check if the user has entre the correct email
const checkEmail = (obj, str) => {
  for (i in obj) {
    if (obj[i].email === str) {
      return true;
    }
  }
  return false;
};
//return the id of User when user enter their email
const getUserByEmail = (obj, email) => {
  for (let i in obj) {
    if (obj[i].email === email) {
      return i;
    }
  }
  return undefined;
};
//return user's url when login with user's ID
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
