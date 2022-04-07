import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import Post from "./model.js";
import { deleteFile, uploadFile } from "../../services/storage/AWS_s3.js";
import User from "../user/model.js";

const router = new Router();

//get all post with the user who have created it
router.get("/", async (req, res) => {
  try {
    return res.json(await Post.find({}).populate("user", "username"));
  } catch (e) {
    console.log({ errorGetPost: e });
  }
});

//get all post of a single user, passing by id
router.get("/:id", validateJWT, async (req, res) => {
  try {
    const foundPost = await Post.find({ user: req.params.id });
    return foundPost ? res.json(foundPost) : res.sendStatus(404);
  } catch (e) {
    console.log({ errorGetPostById: e });
  }
});

//upload post, charge on aws, save on mongo the uri, save on user the new post
router.post("/", validateJWT, async (req, res) => {
  try {
    const newPost = await Post.create({
      type: req.body.type,
      description: req.body.description,
      user: req.user._id,
    });

    const fileName = `${newPost._id}.jpg`;
    const filePath = req.files.file.path;
    const username = req.user.username;

    await uploadFile(fileName, filePath, username);

    newPost.uri = `https://${process.env.AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${username}/${newPost._id}.jpg`;
    newPost.save();

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

//modify post, only the description
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

//delete post from db, delete post from aws, delete post from the user.
router.delete("/:id", validateJWT, async (req, res) => {
  const username = req.user.username;

  const postName = await Post.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  const removeId = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pullAll: { post: [req.params.id] } },
    { new: true }
  );

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

//insert and remove like if user ad or not already put
router.put("/like/:id", validateJWT, async (req, res) => {
  try {
    const currentPost = await Post.findOne({
      _id: req.params.id,
    });

    const findUserInPostLike = currentPost.whoPutLike.filter((u) => {
      if (u.toString() === req.user.id) {
        return true;
      }
    });

    if (!currentPost.whoPutLike.length > 0 || !findUserInPostLike.length > 0) {
      //add
      const putNewLike = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            whoPutLike: [req.user._id],
          },
        },
        { new: true, useFindAndModify: false }
      );
      return putNewLike ? res.sendStatus(204) : res.sendStatus(404);
    } else {
      //remove
      const removeLike = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pullAll: {
            whoPutLike: [req.user._id],
          },
        },
        { new: true, useFindAndModify: false }
      );
      return removeLike ? res.sendStatus(204) : res.sendStatus(404);
    }
  } catch (e) {
    console.log({ errorPutLike: e });
  }
});
export default router;
