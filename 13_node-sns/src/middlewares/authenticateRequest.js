import userModel from "../models/User.js";
import jwt from "jsonwebtoken";

// 全ページ共通で通すミドルウェア (app.use で適用推奨)
export const restoreUser = async (req, res, next) => {
    try {
        // 1. セッションにユーザーがいれば完了
        if (req.session.authUser) {
            res.locals.authUser = req.session.authUser;
            return next();
        }

        // 2. Cookieからトークンを取得
        const { accessToken, refreshToken } = req.cookies;

        // 3. アクセストークンの検証
        if (accessToken) {
            // トークン検証
            const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);
            if (decoded) {
                // DBからユーザーを取得
                const authUser = await userModel.findById(decoded.id);
                if (authUser) {
                    // セッションとレスポンスローカルにユーザーを保存
                    req.session.authUser = authUser;
                    res.locals.authUser = authUser;
                    // 成功したらここで終了
                    return next();
                }
            }
        }

        // 4. リフレッシュトークンの検証（アクセストークン無効）
        if (refreshToken) {
            const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
            if (decoded) {
                const authUser = await userModel.findById(decoded.id);
                if (authUser && authUser.refresh_token === refreshToken) {
                    // トークン生成
                    const { accessToken, refreshToken } = authService.generateTokens(authUser.id);
                    // Cookie保存
                    authService.setAuthCookies(res, accessToken, refreshToken);
                    // リフレッシュトークンをDB更新
                    await userModel.updateRefreshToken(authUser.id, refreshToken);

                    // セッションとレスポンスローカルにユーザーを保存
                    req.session.authUser = authUser;
                    res.locals.authUser = authUser;
                    // 成功したらここで終了
                    return next();
                }
            }
        }
    } catch (err) {
        console.error("Token restoration error:", err.message);
    }

    // 5. 全て失敗した場合はゲスト扱い
    res.locals.authUser = null;
    next();
};

// ログイン済みならログイン画面は見せない
export const guestOnly = (req, res, next) => {
    console.log("guestOnly:", req.session.authUser)
    if (req.session.authUser) {
        return res.redirect("/feed");
    }
    next();
};

// ログイン必須ページ用ミドルウェア
export const authRequired = (req, res, next) => {
    if (!req.session.authUser) {
        // セッションがない場合は、ログインページにリダイレクト
        return res.redirect('/login');
    }
    // そのまま進める
    next();
};