const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { request, response } = require("express");
const generateRandomString = require("./generateRandomString");
const cookieParser = require("cookie-parser");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const user = {};
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
//render the index page with list of urls and short ulrs
app.use(express.static("public"));
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});
//render the get new link page with the input box and submit button
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  console.log(req.cookies["username"]);
  res.render("urls_new", templateVars);
});
//render the registration page
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_register", templateVars);
});

//showing short url and long url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };

  res.render("urls_show", templateVars);
});

//use /u/shortURL to redirect to the actual website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//input a regular url and generate a short url and push in the urlDatabase object
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
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
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});
//enter user name and login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});
//take user to urls once click logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");

  res.redirect("/urls");
});
app.post("/register", (req, res) => {
  console.log(req.body);
  console.log(req.params);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
