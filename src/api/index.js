import { Router } from "express";
import user from "./user/index.js";
import auth from "./auth/index.js";
const router = new Router();

router.use("/user", user);
router.use("/auth", auth);

export default router;
