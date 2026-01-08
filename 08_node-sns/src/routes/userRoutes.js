import { Router } from "express";
import { authRequired } from "../middlewares/authenticateRequest.js";
import { upload } from "../lib/util.js";
import * as userController from "../controllers/UserController.js";

const router = Router();

router.get("/:id/edit", authRequired, userController.edit);
router.get("/:id", authRequired, userController.index);
router.post("/update", authRequired, upload.single('avatar'), userController.update);

export default router;