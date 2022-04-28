import { Router } from "express";
import { validateJWT } from "../../services/jwt/index.js";
import User from "./model.js";

const router = new Router();

//get all user
router.get("/", async (req, res) => {
  return res.json(await User.find({}).populate("post", "uri"));
});

//get user by id
router.get("/:id", validateJWT, async (req, res) => {
  const foundUser = await User.findOne({ _id: req.params.id });
  return foundUser ? res.json(foundUser) : res.sendStatus(404);
});

//insert new user
router.post("/", async (req, res) => {
  try {
    return res.json(await User.create(req.body));
  } catch (e) {
    console.log({ errorPostUser: e });
  }
});

//modify user by id
router.put("/:id", validateJWT, async (req, res) => {
  const foundUser = await User.findOne({ _id: req.params.id });
  if (foundUser) {
    foundUser.set(req.body);
    await foundUser.save();
  }
  return foundUser ? res.json(foundUser) : res.sendStatus(404);
});

//delete user by id
router.delete("/:id", validateJWT, async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });
  return result.deletedCount > 0 ? res.sendStatus(204) : res.sendStatus(404);
});

export default router;
