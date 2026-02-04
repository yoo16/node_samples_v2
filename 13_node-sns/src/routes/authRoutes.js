import { Router } from "express";
import * as HomeController from "../controllers/HomeController.js";
import * as LoginController from "../controllers/LoginController.js";
import { guestOnly, authRequired } from "../middlewares/authenticateRequest.js";
import { validate, loginValidationRules } from "../middlewares/validator.js";

const router = Router();

router.get("/", HomeController.index);
router.get("/login", guestOnly, LoginController.index);
router.post("/login", guestOnly, loginValidationRules, validate, LoginController.auth);
router.post("/logout", authRequired, LoginController.logout);

export default router;