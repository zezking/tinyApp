const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { request, response } = require("express");
const generateRandomString = require("./generateRandomString");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//render the index page with list of urls and short ulrs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//render the get new link page with the input box and submit button
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//showing short url and long url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
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

  console.log(req.body);
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
  console.log(req.params);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
