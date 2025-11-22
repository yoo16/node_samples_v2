import { Router } from "express";
import {
    index,
    login,
    loginPost,
    register,
    registerPost,
    logout,
} from "../controllers/AuthController.js";

// Auth Router
const router = Router();

router.get("/", index);
router.get("/login", login);
router.post("/login", loginPost);
router.get("/register", register);
router.post("/register", registerPost);
router.post("/logout", logout);

export default router;