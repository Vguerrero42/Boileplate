const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../db/models/User");
require("../../nothingToSeeHere");

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
};

const strategy = new GoogleStrategy(
  googleConfig,
  (token, refreshToken, profile, done) => {
    const newUser = {
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id
    };
    User.findOrCreate({
      where: {
        googleId: profile.id
      },
      defaults: newUser
    })
      .spread(user => done(null, user))
      .catch(done);
  }
);

passport.use(strategy);

router.get("/", passport.authenticate("google", { scope: "email" }));

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: "Sumfin aint right bruv ,innit?"
  }) /*or whatever login route is */,
  (req, res) => {
    res.redirect(
      `/users/${req.user.id}`
    ); /*successful authentication redirect*/
  }
);

module.exports = router;
