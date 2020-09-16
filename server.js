import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import pkg from "passport-jwt";
import path from "path";
import keys from "./config/keys.js";
import posts from "./routes/api/posts.js";
import profile from "./routes/api/profile.js";
import users from "./routes/api/users.js";



const { Strategy: JwtStrategy, ExtractJwt } = pkg;
const User = mongoose.model("users");

const app = express();

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// Adding Body Parser middleware to Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(keys.mongoURI)
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

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Serve static asset
if (process.env.NODE_ENV === "production") {
  app.use(express.static("web/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
