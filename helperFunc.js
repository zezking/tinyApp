//check if the user has entre the correct email

let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "mg4vnm" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "mg4vnm" },
  Z3gm4q: { longURL: "https://www.facebook.ca", userID: "7EXK5b" },
  NJku5A: { longURL: "https://www.hansori.ca", userID: "7EXK5b" },
};
//Test Password sdfsdfsdfsd
let users = {
  mg4vnm: {
    id: "mg4vnm",
    email: "zhaoenze001@gmail.com",
    password: "$2b$10$k/ZVjYEjiRXutvVbORJLUuhN0VdzgGOHv9FikpCePzbjNWOyDInU2",
  },
  "7EXK5b": {
    id: "7EXK5b",
    email: "wuhaoppp@163.com",
    password: "$2b$10$RnLjlZn/ZPYT2UJ7fEG16O1kj1xOU9Hg.bsSbH0EizuXnhZ2mNI16",
  },
};

const checkEmail = (urlDatabase, email) => {
  for (const userID in urlDatabase) {
    if (obj[userID].email === email) {
      return true;
    }
  }
  return false;
};
//return the id of User when user enter their email
const getUserByEmail = (obj, email) => {
  for (const i in obj) {
    if (obj[i].email === email) {
      return i;
    }
  }
  return undefined;
};
//return user's url when login with user's ID
const urlsForUser = (obj, userID) => {
  let newObj = {};
  for (const i in obj) {
    if (obj[i].userID === userID) {
      newObj[i] = obj[i];
    }
  }
  return newObj;
};

module.exports = { checkEmail, getUserByEmail, urlsForUser };
