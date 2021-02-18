const bcrypt = require("bcrypt");
const checkEmail = (obj, str) => {
  for (i in obj) {
    if (obj[i].email === str) {
      return true;
    }
  }
  return false;
};

const checkCredential = (obj) => {
  let tempObj = {};
  for (let i in obj) {
    if (!tempObj[obj[i].email]) {
      tempObj[obj[i].email] = {
        id: i,
        email: obj[i].email,
        password: obj[i].password,
      };
    }
  }
  return tempObj;
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

let users = {
  mg4vnm: {
    id: "mg4vnm",
    email: "zhaoenze001@gmail.com",
    password: "$2b$10$7k228Lj8NzxU.1Nme1qIweu97VvGgvewl6zN67V.DCHbroUWdmW8O",
  },
  "7EXK5b": {
    id: "7EXK5b",
    email: "wuhaoppp@163.com",
    password: "$2b$10$b9syDlbeH4VTHfSVc7QGo.El/1J2VCpkawWaLh.p0xMSl5aNh4puW",
  },
};

module.exports = { checkEmail, checkCredential, urlsForUser };
