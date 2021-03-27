const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const bcrypt = require("bcrypt");
const {
  checkEmail,
  getUserByEmail,
  urlsForUser,
  urlDatabase,
  users,
  generateRandomString,
} = require("./helperFunc");

const app = express();
const PORT = process.env.PORT || 5000; // default port 8080
const saltRounds = 10; //declar salt number for hashing

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//render a welcome page if there is no cookie detected
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.userID],
  };
  if (!users[req.session.userID]) {
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

  if (!users[req.session.userID]) {
    res.status(401).render("partials/_permission");
    return;
  } else {
    res.render("urls_index", templateVars);
  }
});

//render the get new link page with the input box and submit button
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.userID] };
  if (!users[req.session.userID]) {
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
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).render("partials/_no");
    return;
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.userID],
  };

  if (!users[req.session.userID]) {
    res.status(401).render("partials/_permission");
    return;
  }
  if (req.session.userID !== urlDatabase[req.params.shortURL].userID) {
    //if the current user ID does not match the ID with the given short URL in urlData base, send error
    res.status(401).render("partials/_unauthorize");
    return;
  }
  res.render("urls_show", templateVars);
});

//use /u/shortURL to redirect to the actual website
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).render("partials/_no");
    return;
  }
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
  if (!users[req.session.userID]) {
    res.status(401).render("partials/_permission");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//add long url edit input text box and edit button to submit the link edited
app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

//check if the login credential is correct, return error if not and redirect to url

app.post("/login", (req, res) => {
  const userIDbyEmail = getUserByEmail(users, req.body.email);

  if (!req.body.email || !req.body.password) {
    res.status(404).render("partials/_noEntry");
    return;
  }
  if (!userIDbyEmail) {
    res.status(401).render("partials/_wrong");
    return;
  }
  //use bcrypt to check if password is correct
  bcrypt.compare(
    req.body.password,
    users[userIDbyEmail].password,
    (err, result) => {
      if (result) {
        req.session.userID = userIDbyEmail;
        res.redirect("/urls");
        return;
      }
      res.status(401).render("partials/_wrong");
    }
  );
});

//take user to urls once click logout and delete cookie
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/");
});
//user registrations pages
app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  if (!req.body.email || !req.body.password) {
    res.status(404).render("partials/_noEntryReg");
    return;
  }

  if (checkEmail(users, req.body.email)) {
    res.status(400).render("partials/_duplicate");
    return;
  }

  bcrypt.hash(req.body.password, saltRounds).then((hash) => {
    users[randomUserID] = {
      id: randomUserID,
      email: req.body.email,
      password: hash,
    };

    req.session.userID = randomUserID;
    res.redirect("/urls");
  });
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
