import userModel from "../models/User.js";
import * as authService from "../services/authService.js";

// ログインページ
export const index = (req, res) => {
    if (req.session.user) {
        // ログインしていれば: Redirect /feed
        return res.redirect("/feed");
    } else {
        // セッションからデータを取得
        const data = {
            user: req.session.input || {},
            error: req.session.error || "",
        }
        // セッションクリア
        req.session.error = "";
        // Render login
        return res.render("login", data);
    }
};

// ログイン処理
export const auth = async (req, res) => {
    const { email, password } = req.body;
    // ログイン検証
    const { user, accessToken, refreshToken } = await authService.verifyLogin(email, password);
    if (!user) {
        req.session.input = { email };
        req.session.error = "メールアドレスとパスワードが間違っています。";
        return res.redirect("/login");
    }
    // リフレッシュトークン更新
    await userModel.updateRefreshToken(user.id, refreshToken);

    // Cookie保存
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "lax"
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax"
    });

    // セッション登録
    req.session.user = user;
    // Redirect /feed
    return res.redirect("/feed");
};

// ログアウト
export const logout = async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.redirect("/login");

    // 1. DBのリフレッシュトークンを消去
    await userModel.updateRefreshToken(user.id, null);

    // 2. Cookieを消去
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 3. ユーザセッションを破棄
    req.session.user = null;
    // Redirect /login
    return res.redirect("/login");
};

// ユーザー登録ページ
export const register = (req, res) => {
    res.render("register", { user: userModel.initUser() });
};