const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { db } = require("./db");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dbStore = new SequelizeStore({ db: db });
const passport = require("passport");
const User = require("./db/models/User");

dbStore.sync();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "very secret",
    store: dbStore,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(done);
});

app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public"));
});

app.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send(err.message || "Internal server error brah");
});

module.exports = app;
