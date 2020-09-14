import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import db from "./config/keys.js";
import posts from "./routes/api/posts.js";
import profile from "./routes/api/profile.js";
import users from "./routes/api/users.js";

import pkg from "passport-jwt";

const { Strategy: JwtStrategy, ExtractJwt } = pkg;
const User = mongoose.model("users");
import keys from "./config/keys.js";

const app = express();

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// Adding Body Parser middleware to Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));

// Adding Passport Middleware
app.use(passport.initialize());
// Passport Config
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => console.log(err));
  })
);

app.get("/", (req, res) => res.send("Hello World from Server"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
