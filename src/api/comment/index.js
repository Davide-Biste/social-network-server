import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Comment from "./model.js";
import Post from "../post/model.js";

const router = new Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find({});
  return comments ? res.json(comments) : res.send(404);
});

router.get("/:id", async (req, res) => {
  try {
    const commentOfPost = await Comment.find({
      post: req.params.id,
    }).populate("user", "username");
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

router.put("/:id", validateJWT, async (req, res) => {
  const commentWhoWantModify = await Comment.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (commentWhoWantModify) {
    commentWhoWantModify.set({
      description: req.body.description,
    });
    await commentWhoWantModify.save();
  }
  return commentWhoWantModify
    ? res.json(commentWhoWantModify)
    : res.sendStatus(404);
});

router.delete("/:id", validateJWT, async (req, res) => {
  const commentWhoWantToDelete = await Comment.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  return commentWhoWantToDelete ? res.send(204) : res.send(404);
});
export default router;
