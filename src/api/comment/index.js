import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Comment from "./model.js";
import Post from "../post/model.js";

const router = new Router();

//get all user
router.get("/:id", validateJWT, async (req, res) => {
  const commentOfAPost = await Post.findById(req.params.id);

  return res.json(await Comment.find({}).populate("post", "uri"));
});

export default router;
