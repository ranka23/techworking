import express from "express";
const router = express.Router();

/*
  @route GET api/posts/test
  @desc Tests post route
  @access Public
*/
router.get("/test", (_req, res) => res.json({ message: "Posts Works" }));

export default router;
