import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Comment from "./model.js";
import Post from "../post/model.js";

const router = new Router();

router.get("/:id", async (req, res) => {
  try {
    const commentOfPost = await Comment.find({
      post: req.params.id,
    });
    return commentOfPost ? res.json(commentOfPost) : res.send(404);
  } catch (e) {
    console.log({ errorGetCommentFromPost: e });
  }
});

//new comment
router.post("/:id", validateJWT, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (foundPost) {
      const newComment = await Comment.create({
        description: req.body.description,
        user: req.user.id,
        post: foundPost._id,
      });
      return res.json(newComment);
    }
  } catch (e) {
    console.log({ errorNewComment: e });
  }
});

export default router;
