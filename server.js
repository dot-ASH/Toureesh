import express from "express";
import dotenv from "dotenv";
import router from "./routes/main.js";
import session from "express-session";
import flash from "express-flash";
import passport from "passport";

dotenv.config();

const server = express();
const log    = console.log;
const PORT   = process.env["PORT"] || 4000;

server.set("view engine", "ejs");
server.use(express.static("assets/css"));
server.use(express.static("assets/js"));
server.use(express.static("assets/img"));
server.use(express.urlencoded({ extended: false}))
server.use(session({
  secret: process.env["SECRET"],
  resave: false,
  saveUninitialized: false
}))
server.use(passport.initialize());
server.use(passport.session())
server.use(flash())
server.use("/", router);
server.listen(PORT, () => {
  log(`server running on ${PORT}`);
});