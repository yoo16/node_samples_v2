import { Router } from "express";
import * as HomeController from "../controllers/HomeController.js";
import * as LoginController from "../controllers/LoginController.js";

// Auth Router
const router = Router();

router.get("/", HomeController.index);
router.get("/login", LoginController.index);
router.post("/login", LoginController.auth);
router.post("/logout", LoginController.logout);

export default router;