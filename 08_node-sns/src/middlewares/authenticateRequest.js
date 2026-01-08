import userModel from "../models/User.js";
import * as authService from "../services/authService.js";

// 全ページ共通で通すミドルウェア (app.use で適用推奨)
export const restoreUser = async (req, res, next) => {
    // 1. セッションにユーザーがいれば即終了（負荷軽減）
    if (req.session.user) {
        console.log(req.session.user)
        res.locals.authUser = req.session.user;
        return next();
    }

    // 2. アクセストークンの検証
    try {
        // アクセストークンを検証
        const user = await authService.verifyToken(req.cookies?.accessToken);
        if (user) {
            // 新しいアクセストークンをCookieにセット
            authService.saveAccessToken(res, user);
            // セッション更新
            const authUser = await userModel.findById(user.id);
            req.session.user = authUser;
            res.locals.authUser = authUser;
            // そのまま進める
            return next();
        }
    } catch (err) {
        // 期限切れなどの場合はリフレッシュトークンの確認へ進む
        console.log("Access token expired, trying refresh token...");
    }

    // 3. リフレッシュトークンの検証（アクセストークンが無効な場合のみ）
    try {
        // リフレッシュトークンを検証
        const user = await authService.verifyToken(req.cookies?.refreshToken);
        if (user) {
            // 新しいアクセストークンを生成
            const newAccessToken = await authService.generateAccessToken(user);
            // 新しいアクセストークンをCookieにセット
            await saveAccessToken(res, newAccessToken);

            // 新しいリフレッシュトークンを生成
            const newRefreshToken = await authService.generateRefreshToken(user);
            // リフレッシュトークンを更新
            await userModel.updateRefreshToken(user.id, newRefreshToken);
            // リフレッシュトークンをCookieにセット
            await saveRefreshToken(res, newRefreshToken);
            // セッション更新
            const authUser = await userModel.findById(user.id);
            req.session.user = authUser;
            res.locals.authUser = authUser;
            return next();
        }
    } catch (err) {
        console.warn("Refresh Token invalid:", err.message);
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

/**
 * Cookie保存系 (同期処理)
 */
export const saveAccessToken = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "lax"
    });
};

export const saveRefreshToken = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax"
    });
};