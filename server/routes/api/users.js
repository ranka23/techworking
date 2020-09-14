import express from "express";
const router = express.Router();

/*
  @route GET api/users/test
  @desc Tests users route
  @access Public
*/
router.get("/test", (_req, res) => res.json({ message: "Users Works" }));

export default router;
