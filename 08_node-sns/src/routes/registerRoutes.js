import { Router } from "express";
import * as RegisterController from "../controllers/RegisterController.js";

// Auth Router
const router = Router();

router.get("/", RegisterController.index);
router.post("/", RegisterController.add);

export default router;