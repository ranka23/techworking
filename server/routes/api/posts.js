import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import passport from "passport";
import Post from "../../models/Post.js";
import validatePost from "../../validation/post.js";
import Profile from "../../models/Profile.js";

/*
  @route GET api/posts/test
  @desc Tests post route
  @access Public
*/
router.get("/test", (_req, res) => res.json({ message: "Posts Works" }));

/*
  @route GET api/posts
  @desc Get all posts
  @access Public
*/
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "Posts not found" }));
});

/*
  @route GET api/posts/:id
  @desc Get post as per post id
  @access Public
*/
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json({ nopostfound: "Post not found" }));
});

/*
  @route POST api/posts
  @desc Create a new post
  @access Private
*/
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

/*
  @route DELETE api/posts
  @desc Delete post as per post id
  @access Private
*/
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Verify if post belongs to user
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ unauthorized: "Unauthorized." });
          }

          // Delete the post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Couldn't find the post" })
        );
    });
  }
);

/*
  @route POST api/posts/like/:id
  @desc Like post as per user id
  @access Private
*/
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({
              alreadyliked: "This post has already received your like",
            });
          }
          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Couldn't find the post" })
        );
    });
  }
);

/*
  @route POST api/posts/like/:id
  @desc Unlike as per user id
  @access Private
*/
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({
              unliked: "Like this post in order to unlike it",
            });
          }
          // Get index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // Splice the like array to remove the post
          post.likes.splice(removeIndex, 1);

          // Save the changes in DB
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Couldn't find the post" })
        );
    });
  }
);

/*
  @route POST api/posts/comment/:id
  @desc Comment to post as per post id
  @access Private
*/
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePost(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avar,
          user: req.user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

/*
  @route DELETE api/posts/comment/:id/:comment_id
  @desc Delete comment as per post id and comment id
  @access Private
*/
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentdoesnotexits: "Comment doesn't exists" });
        }

        // Get index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

export default router;
