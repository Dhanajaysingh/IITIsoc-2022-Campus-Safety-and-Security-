require("dotenv").config();
const express = require("express");
const path = require("path");
require("./db/conn");
const Signin = require("./models/signins");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const app = express();
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");
const partials_path = path.join(__dirname, "../views/partial");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
hbs.registerPartials(partials_path);
//routing
app.get("/", auth, (req, res) => {
  res.render("Homepage");
});
app.get("/contact", auth, (req, res) => {
  res.render("contact");
});
app.get("/protect1", auth, (req, res) => {
  res.render("protect1");
});
app.get("/security", auth, (req, res) => {
  res.render("security");
});
app.get("/emergency", auth, (req, res) => {
  res.render("emergency");
});
app.get("/alertfull", auth, (req, res) => {
  res.render("alertfull");
});
app.get("/committeedep", auth, (req, res) => {
  res.render("committeedep");
});
app.get("/committeedip", auth, (req, res) => {
  res.render("committeedip");
});
app.get("/dosanddonts", auth, (req, res) => {
  res.render("Dosanddonts");
});
app.get("/Events", auth, (req, res) => {
  res.render("webdteam");
});
app.get("/safetymaterial", auth, (req, res) => {
  res.render("safetymaterial");
});
app.get("/vehicle", auth, (req, res) => {
  res.render("vehicle");
});
app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });
    res.status(202).clearCookie("jwt");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/signin", (req, res) => {
  res.render("signin");
});
app.post("/signin", async (req, res) => {
  try {
    const signStudent = new Signin({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const token = await signStudent.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 6000000),
      httpOnly: true,
    });
    const signed = await signStudent.save();

    res.status(201).render("login");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Signin.findOne({ email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 6000000),
      httpOnly: true,
    });
    if (isMatch) {
      res.status(201).render("Homepage");
    } else {
      res.status(400).send("invalid login details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});
//server creation
app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});
