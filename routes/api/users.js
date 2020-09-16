import express from "express";
import User from "../../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../../config/keys.js";
import passport from "passport";
import validateRegisterInput from "../../validation/register.js";
import validateLoginInput from "../../validation/login.js";

const router = express.Router();
/*
  @route GET api/users/test
  @desc Tests users route
  @access Public
*/
router.get("/test", (_req, res) => res.json({ message: "Users Works" }));

/*
  @route POST api/users/register
  @desc Register user
  @access Public
*/
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";

      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // s -> size
        r: "pg", // r -> rating
        d: "mm", // d -> default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

/*
  @route POST api/users/register
  @desc Login user and return token
  @access Public
*/
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    console.log(user);
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create a jwt token since user matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`,
            });
          }
        );
      } else {
        errors.password = "Incorrect Password";
        res.status(400).json(errors);
      }
    });
  });
});

/*
  @route GET api/users/register
  @desc Return current User
  @access Private
*/
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

export default router;
