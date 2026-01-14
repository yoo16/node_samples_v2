import userModel from "../models/User.js";
import * as authService from "../services/authService.js";

// ログインページ
export const index = (req, res) => {
    // セッションからデータを取得
    const data = {
        input: req.session.input || {},
        errors: req.session.errors || [],
    }
    // セッションクリア
    req.session.errors = [];
    // Render login
    return res.render("login", data);
};

// ログイン処理
export const auth = async (req, res) => {
    const { email, password } = req.body;
    // ログイン検証
    const result = await authService.verifyLogin(email, password);
    const { user, accessToken, refreshToken } = result ?? {};

    // ログイン失敗
    if (!user) {
        req.session.input = { email };
        req.session.errors = ["メールアドレスとパスワードが間違っています。"];
        return res.redirect("/login");
    }
    // ユーザセッション登録
    req.session.authUser = user;

    // アクセストークン: Cookie保存
    authService.setAuthCookies(res, accessToken, refreshToken);
    // リフレッシュトークン更新
    await userModel.updateRefreshToken(user.id, refreshToken);
    // セッションクリア
    req.session.errors = [];
    req.session.input = {};
    // Redirect /feed
    return res.redirect("/feed");
};

// ログアウト
export const logout = async (req, res) => {
    const user = req.session?.authUser;
    if (!user) return res.redirect("/login");

    // 1. DBのリフレッシュトークンを消去
    await userModel.updateRefreshToken(user.id, null);

    // 2. Cookieを消去
    authService.clearAuthCookies(res);

    console.log("logout!!!")
    // 3. ユーザセッションを破棄
    req.session.authUser = null;
    // Redirect /login
    return res.redirect("/login");
};

// ユーザー登録ページ
export const register = (req, res) => {
    res.render("register", { user: userModel.initUser() });
};