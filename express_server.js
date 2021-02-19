const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { request, response } = require("express");
const generateRandomString = require("./generateRandomString");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { checkEmail, getUserByEmail, urlsForUser } = require("./helperFunc");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "mg4vnm" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "mg4vnm" },
  Z3gm4q: { longURL: "https://www.facebook.ca", userID: "7EXK5b" },
  NJku5A: { longURL: "https://www.hansori.ca", userID: "7EXK5b" },
};

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

app.set("view engine", "ejs");
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
//render a welcome page if there is no cookie detected
app.get("/welcome", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.userID],
  };
  if (users[req.session.userID] === undefined) {
    res.render("urls_welcome", templateVars);
  } else {
    res.redirect("/urls");
  }
});

//render the index page with list of urls and short ulrs
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(urlDatabase, req.session.userID),
    user: users[req.session.userID],
  };

  if (users[req.session.userID] === undefined) {
    res.redirect("/welcome");
  } else {
    res.render("urls_index", templateVars);
  }
});

//render the get new link page with the input box and submit button
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.userID] };
  if (users[req.session.userID] === undefined) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});
//render the registration page
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.userID],
  };

  res.render("urls_register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  res.render("urls_login", templateVars);
});

//showing short url and long url
app.get("/urls/:shortURL", (req, res) => {
  if (users[req.session.userID] === undefined) {
    res.send("You need to log in");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.userID],
    };
    res.render("urls_show", templateVars);
  }
});

//use /u/shortURL to redirect to the actual website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//input a regular url and generate a short url and push in the urlDatabase object
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID,
  };
  res.redirect(`/urls/` + shortURL);
});

//add delete buttons
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//add url edit in urls_index.ejs
app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect("/urls/" + req.params.shortURL);
});

//add long url edit input text box and edit button to submit the link edited
app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

//check if the login credential is correct, return error if not and redirect to url

//sdfsdfsdfsd
app.post("/login", (req, res) => {
  let userIDbyEmail = getUserByEmail(users, req.body.email);

  if (req.body.email === "" || req.body.password === "") {
    res.status(404).send("<>Please Enter Email or Password</>");
  } else if (userIDbyEmail === undefined) {
    res.status(401).send("<h1>No user with that username found</h1>");
  } else {
    bcrypt.compare(
      req.body.password,
      users[userIDbyEmail].password,
      (err, result) => {
        if (result) {
          req.session.userID = userIDbyEmail;
          res.redirect("/urls");
        } else {
          res.status(401).send("<h1>No user with that username found</h1>");
        }
      }
    );
  }
});

//take user to urls once click logout
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.status(404).send("<h1>Please Enter Email or Password</h1>");
  } else if (checkEmail(users, req.body.email)) {
    res.status(400).send("<h1>Account Exist</h1>");
  } else {
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
      users[randomUserID] = {
        id: randomUserID,
        email: req.body.email,
        password: hash,
      };

      req.session.userID = randomUserID;
      res.redirect("/urls");
    });
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
