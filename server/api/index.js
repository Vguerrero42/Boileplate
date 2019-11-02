const router = require("express").Router();
const User = require("../db/models/User");
const chalk = require("chalk");

router.get("/", (req, res, next) => {
  res.send("YERRRR");
});

router.use(function(req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});
module.exports = router;
