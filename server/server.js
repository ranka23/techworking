import express from "express";
import mongoose from "mongoose";
import db from "./config/keys.js";
import users from './routes/api/users.js'
import profile from './routes/api/profile.js'
import posts from './routes/api/posts.js'

const app = express();

// Connect to MongoDB
mongoose 
  .connect(db.mongoURI)
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World from Server"));

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
