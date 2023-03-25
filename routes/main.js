import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool } from "../assets/config/dbconfig.js";
import bcrypt from "bcrypt";
import flash from "express-flash";
import passport from "passport";
import initializePassport from "../assets/config/passconfig.js";

import { render } from "ejs";
import nodemailer from "nodemailer";

const log = console.log;
const router = express.Router();

initializePassport(passport);

/* GETTERS */
// GET-PACKAGES
var packages = [];
var getPackages = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM packages ORDER BY id ASC;", (err, result) => {
      if (err) {
        throw err;
      }
      packages = result.rows;
      resolve(packages);
    });
  });
};
await getPackages();
// GET-PLACES
var places = [];
var getPlaces = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM places", (err, result) => {
      if (err) {
        log(err);
      }
      result.rows.forEach((row) => {
        places = result.rows;
        resolve(places);
      });
    });
  });
};
await getPlaces();
// GET-DISCOUNTS
var discounts = [];
var getDiscounts = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM discounts", (err, result) => {
      if (err) {
        log(err);
      }
      result.rows.forEach((row) => {
        discounts.push({
          title: row.name,
          imageUrl: row.image,
          details: row.details,
        });
        resolve(result.rows);
      });
    });
  });
};
await getDiscounts();
// GET-BOOKINGS
var bookings = [];
var getBooking = function (id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM booking WHERE user_id= $1;",
      [id],
      (err, result) => {
        if (err) {
          log(err);
        }
        for (let i = 0; i < result.rowCount; i++) {
          bookings[i] = {
            id: result.rows[i].id,
            package_name: result.rows[i].package_name,
            created_on: result.rows[i].date,
            progress: result.rows[i].progress,
          };
        }
        resolve(bookings);
      }
    );
  });
};

/* MAIN PAGE */
let sideBar = [];
router.get("/", async (req, res) => {
  var name;
  if (req.isAuthenticated()) {
    name = req.user.name;
    sideBar[0].status = "Your profile";
    sideBar[0].bookingSite = "/myProfile";
    sideBar[0].profileName = name;
    sideBar[0].isLogin = "";
    console.log(req.user);
  } else {
    sideBar = [
      {
        profileName: "",
        status: "Try login first",
        bookingSite: "/#login",
        isLogin: "no",
      },
    ];
  }
  await getPackages();
  res.render("index", {
    packages: packages.splice(0, 4),
    places: places,
    discounts: discounts,
    user: name || "User",
    sideBar: sideBar,
  });
});

/* LOGIN */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/#login",
    failureFlash: true,
  })
);

/* REGISTRATION */
router.get("/registration", (req, res) => {
  res.render("reg");
});

router.post("/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  log({
    name,
    email,
  });

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("reg", { errors, name, email, password, password2 });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      `SELECT * FROM users
      WHERE email = $1`,
      [email],
      (err, result) => {
        if (err) {
          throw err;
        }
        if (result.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("reg", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/#login");
              sendMail(
                email,
                name,
                "Registration Successful",
                "Thank you for relying on us. You won't be dissapointed"
              );
            }
          );
        }
      }
    );
  }
});

/* GAUTH */
// router.get(
//   "/gAuth",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/gAuth/redirect",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     res.redirect("/");
//   }
// );

/* LOGOUT */
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

/* PROFILE */
router.get("/myProfile", async (req, res) => {
  if (req.isAuthenticated()) {
    let users = req.user;
    await getBooking(users.id);
    console.log(bookings);
    return res.render("my-profile", { user: users, bookings });
  }
  return res.redirect("/#login");
});

// EDIT_PROFILE
router.post("/EditProfile", (req, res) => {
  let { email, mblno, age, address, city, prof } = req.body;
  pool.query(
    `UPDATE users SET email=$1, mobileno=$2, age=$3, address=$4, city=$5, profession=$6 WHERE id=$7`,
    [email, mblno, age, address, city, prof, req.user.id],
    (err, result) => {
      if (err) {
        throw err;
      }
      req.flash("success_msg", "Changes have been saved successfuly");
      return res.redirect("/myProfile");
    }
  );
});

// CANCLE-BOOKING
router.post("/cancleBooking", (req, res) => {
  let body = req.body;
  pool.query(
    `DELETE FROM booking WHERE id= $1`,
    [body.bookingId],
    async (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
  req.flash("success_msg", "Booking has been cancled");
  const indexOfObject = bookings.findIndex((object) => {
    return object.id === body.bookingId;
  });
  bookings.splice(indexOfObject, 1);
  res.redirect("myProfile");
});

// PACKAGES_PAGE
packages.forEach((element, index) => {
  router.get(element.url, async (req, res) => {
    var name;
    if (req.isAuthenticated()) {
      name = req.user.name;
      sideBar[0].status = "Your profile";
      sideBar[0].bookingSite = "/myProfile";
      sideBar[0].profileName = name;
      sideBar[0].isLogin = "";
      console.log(req.user);
    } else {
      sideBar = [
        {
          profileName: "",
          status: "Try login first",
          bookingSite: "/#login",
          isLogin: "no",
        },
      ];
    }

    await getPackages();
    req.session.package = {};
    req.session.package = JSON.stringify(packages[index]);

    res.render("packages", {
      packages: packages,
      user: name || "User",
      sideBar: sideBar,
      elementno: index,
    });
  });
});

// RATING
router.post("/packages/rating", (req, res) => {
  if (req.isAuthenticated()) {
    let score = req.body.score;
    let packageName = req.body.packageName;
    let reviewText = req.body.review;
    pool.query(
      `INSERT INTO reviews(user_id, package, rate, review) VALUES ($1, $2, $3, $4);`,
      [req.user.id, packageName, score, reviewText],
      (err, result) => {
        if (err) throw err;
        pool.query(
          `SELECT rate  FROM reviews WHERE package=$1;`,
          [packageName],
          (err, result) => {
            if (err) throw err;
            let resultCount = 0;
            result.rows.forEach((row) => {
              resultCount += row.rate;
            });
            let pacScore = resultCount / result.rowCount;
            pool.query(
              `UPDATE packages SET rating= $1 WHERE name= $2;`,
              [pacScore, packageName],
              (err, result) => {
                if (err) throw err;
                req.flash("success_msg", "thank you for you feedback!");
                res.redirect("back");
              }
            );
          }
        );
      }
    );
  } else {
    req.flash("success_msg", "You need to login first");
    res.redirect("/#login");
  }
});

// PAYMENT
router.get("/payment", async (req, res) => {
  if (req.isAuthenticated()) {
    let users = req.user;
    let name = req.user.name;
    sideBar[0].status = "Your profile";
    sideBar[0].bookingSite = "/myProfile";
    sideBar[0].profileName = name;
    sideBar[0].isLogin = "";
    var package_session = JSON.parse(req.session.package);
    console.log(package_session);
    await getPackages();
    let packagePrice = package_session.price;
    return res.render("payment", {
      users,
      sideBar,
      packagePrice,
      package_session,
    });
  } else return res.redirect("/#login");
});

router.post("/paymentForBooking", (req, res) => {
  let paymentMethod = req.body.securePayment;
  console.log(paymentMethod);
  if (paymentMethod === "Cash") {
    let { amountI, packageSelect } = req.body;
    pool.query(
      `INSERT INTO booking(package_name, progress, date, user_id, amount)
      VALUES ($1, 'pending', CURRENT_DATE, $2, $3)`,
      [packageSelect, req.user.id, amountI],
      (err, result) => {
        if (err) {
          throw err;
        }
        req.flash("success_msg", "Booking Successful");
        res.redirect("/myProfile");
      }
    );
  } else {
    let { amountI, packageSelect } = req.body;
    pool.query(
      `INSERT INTO booking(package_name, progress, date, user_id, amount)
        VALUES ($1, 'paid', CURRENT_DATE, $2, $3)`,
      [packageSelect, req.user.id, amountI],
      (err, result) => {
        if (err) {
          throw err;
        }
        req.flash("success_msg", "Booking Successful");
        res.redirect("/myProfile");
      }
    );
  }
});

// FROGET_PASS
router.get("/forgetPass", (req, res) => {
  res.render("forget-pass");
});

router.get("/forgetPass001e0942", (req, res) => {
  res.render("reset-pass");
});

router.post("/forgetPass", (req, res) => {
  const email = req.body.email;

  let errors = [];
  pool.query(`SELECT * FROM users WHERE email= $1`, [email], (err, result) => {
    console.log(result.rowCount);
    if (err) {
      throw err;
    } else if (result.rowCount <= 0) {
      req.flash("success_msg", "No registered email addresse with this entry!");
      res.redirect("/forgetPass");
    } else if (result.rowCount === 1) {
      sendMail(
        email,
        "Dear " + email,
        "reset your password",
        "reset your password from this link " +
          "http://localhost:3000/forgetPass001e0942"
      );
      req.flash("success_msg", "check your mail box to reset the password!");
      res.redirect("/#login");
    }
  });
});

router.post("/resetPass", async (req, res) => {
  let { email, password, password2 } = req.body;
  let errors = [];

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("reset-pass", { errors, email, password, password2 });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      `UPDATE users SET password = $1 WHERE email = $2`,
      [hashedPassword, email],
      (err, results) => {
        if (err) {
          throw err;
        }
        req.flash("success_msg", "Password reset successful!");
        res.redirect("/#login");
      }
    );
  }
});

/* ADMIN */
router.get("/devadminlogin", (req, res) => {
  res.render("admin");
});

router.post("/admin-dashboard", (req, res) => {
  pool.query(
    "SELECT * FROM admin WHERE username = $1 and password = $2",
    [req.body.username, req.body.password],
    (err, result) => {
      if (err) {
        return console.error("Error executing query", err.stack);
      }
      if (result.rowCount > 0) {
        res.render("admin-dashboard");
      } else res.redirect("/devadminlogin");
    }
  );
});

router.post("/entry", (req, res) => {
  pool.query(
    "INSERT INTO packages(name, location, price_tag, rating, image, url) VALUES($1, $2, $3, $4, $5, $6)",
    [
      req.body.name,
      req.body.location,
      req.body.price_tag,
      req.body.rating,
      req.body.image,
      req.body.url,
    ],
    (err, result) => {
      if (err) {
        return console.error("Error executing query", err.stack);
      }
      res.render("admin-dashboard");
    }
  );
});

/* MAIL-SYSTEM */
function sendMail(email, name, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: "me",
    bcc: email,
    subject: subject,
    text: name + "! " + text,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });
}
export default router;
