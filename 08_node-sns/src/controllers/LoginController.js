import authService from "../services/authService.js";
import userModel from "../models/User.js";

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

    const { user, accessToken, refreshToken } = await authService.verifyLogin(email, password);

    if (!user || !accessToken || !refreshToken) {
        req.session.input = { email };
        req.session.error = "メールアドレスとパスワードが間違っています。";
        return res.redirect("/login");
    }

    // セッション登録
    req.session.user = user;

    // アクセストークン (短命: 15分)
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 15
    });

    // リフレッシュトークン (長命: 30日)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

    return res.redirect("/");
};

// ログアウト
export const logout = async (req, res) => {
    req.session.destroy(() => {
        // Cookie削除
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        // DB更新
        userModel.updateRefreshToken(req.session.user.id, null);
        // Redirect /login
        res.redirect("/login");
    });
};

// ユーザー登録ページ
export const register = (req, res) => {
    res.render("register", { user: userModel.initUser() });
};