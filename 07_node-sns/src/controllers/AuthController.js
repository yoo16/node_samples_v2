import authService from "../services/authService.js";
import userModel from "../models/User.js";

// トップページ
export const index = (req, res) => {
    // 既にログインしている場合
    if (req.session.user) {
        // Redirect /feed
        return res.redirect("/feed");
    }
    // Redirect /login
    return res.redirect("/login");
};

// ログインページ
export const login = (req, res) => {
    if (req.session.user) {
        // Redirect /feed
        return res.redirect("/feed");
    }
    // Render login
    res.render("login", { user: { email: "user1@test.com" } });
};

// ログイン処理
export const loginPost = async (req, res) => {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
        // Render login
        return res.render("login", { user: { email } });
    }

    // ユーザー認証
    const { user, token } = await authService.auth(email, password);

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

// ユーザー登録処理
export const registerPost = async (req, res) => {
    const { name, email, password } = req.body;

    // validation
    if (!email || !password) {
        // Render register
        return res.render("register", { error: "メールとパスワードは必須です" });
    }

    // 新規ユーザー
    const newUser = { name, email, password };
    // ユーザー登録
    const userId = await userModel.save(newUser);

    if (userId) {
        // Redirect /login
        return res.redirect("/login");
    }

    // Render register
    res.render("register", { error: "登録に失敗しました" });
};