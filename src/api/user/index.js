import { request, Router } from "express";
import User from "./model.js";

const router = new Router();

router.get("/", async (req, res) => {
  return res.json(await User.find({}));
});

router.get("/:id", async (req, res) => {
  const element = await User.findOne({ _id: request.params.id });
  return element ? res.json(element) : res.sendStatus(404);
});

router.post("/", async (req, res) => {
  try {
    return res.json(await User.create(req.body));
  } catch (e) {
    console.log({ errorPostUser: e });
  }
});

export default router;
