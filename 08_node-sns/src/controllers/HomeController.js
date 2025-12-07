import authService from "../services/authService.js";
import userModel from "../models/User.js";

// ログインページ
export const index = (req, res) => {
    if (req.session.user) {
        // Redirect /feed
        return res.redirect("/feed");
    }
    // Render login
    res.render("login", { user: { email: "user1@test.com" } });
};