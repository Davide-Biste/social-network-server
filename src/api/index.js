import { Router } from "express";
import user from "./user/index.js";
const router = new Router();

router.use("/user", user);

export default router;
