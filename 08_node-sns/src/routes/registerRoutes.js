import { Router } from "express";
import * as RegisterController from "../controllers/RegisterController.js";
import { validate, registerValidationRules } from "../middlewares/validator.js";

// Auth Router
const router = Router();

router.get("/", RegisterController.index);
router.post("/", registerValidationRules, validate, RegisterController.add);

export default router;