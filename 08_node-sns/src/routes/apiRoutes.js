import { Router } from "express";
import { toggle } from "../controllers/api/LikeController.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// Like API
router.post("/feed/:id/like", authRequired, toggle);

export default router;