import authService from "../services/authService.js";
import userModel from "../models/User.js";

// ログインページ
export const index = (req, res) => {
    if (req.session.user) {
        // Redirect /feed
        return res.redirect("/feed");
    } else {
        // Render login
        res.render("login", { user: { email: "user1@test.com" } });
    }
};

// ログイン処理
export const auth = async (req, res) => {
    // email, password 取得
    const { email, password } = req.body;
    // バリデーション
    if (!email || !password) {
        // Render login
        return res.render("login", { user: { email } });
    }

    // ユーザー認証
    const { user, token } = await authService.auth(email, password);
    console.log(token)

    // 認証失敗
    if (!user || !token) {
        // Render login
        return res.render("login", { user: { email } });
    }

    // セッション登録
    req.session.user = user;

    // Cookie登録
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // Redirect /feed
    res.redirect("/feed");
};

// ログアウト
export const logout = async (req, res) => {
    req.session.destroy(() => {
        // Cookie削除
        res.clearCookie("token");
        // Redirect /login
        res.redirect("/login");
    });
};

// ユーザー登録ページ
export const register = (req, res) => {
    res.render("register", { user: userModel.initUser() });
};