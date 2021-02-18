const checkEmail = (obj, str) => {
  for (i in obj) {
    if (obj[i].email === str) {
      return true;
    }
  }
  return false;
};

const checkCredential = (obj, email, password) => {
  for (i in obj) {
    if (obj[i].email === email && obj[i].password === password) {
      return i;
    }
  }
  return false;
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

module.exports = { checkEmail, checkCredential, urlsForUser };
