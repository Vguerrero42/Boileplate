const router = require("express").Router();
const User = require("../db/models/User");

router.get("/me", (req, res, next) => {
  res.send(req.user);
});

router.put("/login", async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) res.status(401).send("User not found");
    else if (!user.correctPassword(req.body.password))
      res.status(401).send("Wrong Password Buddy");
    else {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    let user = await User.create({
      email: req.body.email,
      password: req.body.password
    });
    req.login(user, err => {
      if (err) next(err);
      else res.send(user);
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(204);
});

module.exports = router;
