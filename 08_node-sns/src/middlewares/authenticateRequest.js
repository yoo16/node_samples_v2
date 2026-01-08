// JWTモジュール
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

// 全ページ共通で通すミドルウェア (app.use で適用推奨)
export const restoreUser = async (req, res, next) => {
    // 1. セッションにユーザーがいれば即終了（負荷軽減）
    if (req.session.user) {
        res.locals.authUser = req.session.user;
        return next();
    }

    // 2. アクセストークンの検証
    //  Cookieからトークンを取得
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            if (user) {
                req.session.user = user;
                res.locals.authUser = user;
                return next();
            }
        } catch (err) {
            // 期限切れなどの場合はリフレッシュトークンの確認へ進む
            console.log("Access token expired, trying refresh token...");
        }
    }

    // 3. リフレッシュトークンの検証（アクセストークンが無効な場合のみ）
    if (refreshToken) {
        try {
            const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);

            if (user) {
                // 新しいアクセストークンを再発行
                const newAccessToken = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: "15m" }
                );

                // 新しいトークンをCookieにセット
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000
                });

                req.session.user = user;
                res.locals.authUser = user;
                return next();
            }
        } catch (err) {
            console.warn("Refresh Token invalid:", err.message);
        }
    }

    // 4. どちらも無効な場合はゲスト扱い
    res.locals.authUser = null;

    // そのまま進める
    next();
};

// ログイン必須ページ用ミドルウェア
export const authRequired = (req, res, next) => {
    if (!req.session.user) {
        // セッションがない場合は、ログインページにリダイレクト
        return res.redirect('/login');
    }
    // そのまま進める
    next();
};