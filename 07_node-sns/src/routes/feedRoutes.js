import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { index, show, search, add } from "../controllers/FeedController.js";

const router = Router();

router.get("/feed", authRequired, index);
router.post("/feed/add", authRequired, add);
router.get("/feed/:id/show", authRequired, show);
router.get("/feed/search", authRequired, search);

export default router;