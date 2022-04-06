import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Post from "./model.js";
import { deleteFile, uploadFile } from "../../services/storage/AWS_s3.js";
import User from "../user/model.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    return res.json(await Post.find({}).populate("user", "username"));
  } catch (e) {
    console.log({ errorGetPost: e });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  try {
    const foundPost = await Post.find({ user: req.params.id });
    return foundPost ? res.json(foundPost) : res.sendStatus(404);
  } catch (e) {
    console.log({ errorGetPostById: e });
  }
});

router.post("/", validateJWT, async (req, res) => {
  try {
    const fileName = req.files.file.name;
    const filePath = req.files.file.path;
    const username = req.user.username;

    await uploadFile(fileName, filePath, username);
    const newPost = await Post.create({
      type: req.body.type,
      name: fileName,
      description: req.body.description,
      uri: `https://${process.env.AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${req.user.username}/${fileName}`,
      user: req.user._id,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { post: newPost._id } },
      { new: true, useFindAndModify: false }
    );

    return res.json(newPost);
  } catch (e) {
    console.log({ errorPostPost: e });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  const element = await Post.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (element) {
    element.set({
      description: req.body.description,
    });
    await element.save();
  }
  return element ? res.json(element) : res.sendStatus(404);
});

router.delete("/:id", validateJWT, async (req, res) => {
  const username = req.user.username;
  const postName = await Post.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  const result = await Post.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  }).then(async (result) => {
    if (result.deletedCount > 0) {
      await deleteFile(postName.name, username);
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });
});
export default router;
