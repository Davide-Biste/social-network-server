import { Router } from "express";
import User from "./model.js";

const router = new Router();

router.get("/", async (req, res) => {
  return res.json(await User.find({}));
});

export default router;
