import { Router } from "express";
import user from "./user/index.js";
import auth from "./auth/index.js";
import post from "./post/index.js";
import comment from "./comment/index.js";
const router = new Router();

router.use("/user", user);
router.use("/auth", auth);
router.use("/post", post);
router.use("/comment", comment);

export default router;
