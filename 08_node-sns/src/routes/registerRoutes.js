import { Router } from "express";
import * as RegisterController from "../controllers/RegisterController.js";

// Auth Router
const router = Router();

router.get("/register", RegisterController.index);
router.post("/register", RegisterController.add);

export default router;