import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Post from "./model.js";
import { uploadFile } from "../../services/storage/upload.js";
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
    const foundPost = await Post.find({ _id: req.params.id });
    return foundPost ? res.json(foundPost) : res.sendStatus(404);
  } catch (e) {
    console.log({ errorGetPostById: e });
  }
});

router.post("/", validateJWT, async (req, res) => {
  try {
    const fileName = req.files.file.name;

    await uploadFile(fileName, req.files.file.path);
    const newPost = await Post.create({
      type: req.body.type,
      description: req.body.description,
      uri: `https://${process.env.AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${fileName}`,
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

export default router;
