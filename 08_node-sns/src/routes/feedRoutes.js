import { Router } from "express";
import { authRequired } from "../middlewares/authenticateRequest.js";
import * as FeedController from "../controllers/FeedController.js";

const router = Router();

router.get("/", authRequired, FeedController.index);
router.post("/add", authRequired, FeedController.add);
router.get("/:id/show", authRequired, FeedController.show);
router.get("/search", authRequired, FeedController.search);

export default router;