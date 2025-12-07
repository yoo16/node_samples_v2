import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import * as FeedController from "../controllers/FeedController.js";

const router = Router();

router.get("/feed", authRequired, FeedController.index);
router.post("/feed/add", authRequired, FeedController.add);
router.get("/feed/:id/show", authRequired, FeedController.show);
router.get("/feed/search", authRequired, FeedController.search);

export default router;