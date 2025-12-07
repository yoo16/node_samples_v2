import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

export const auth = async (req, res, next) => {

    // 既に session がある → OK
    if (req.session.user) {
        res.locals.authUser = req.session.user;
        return next();
    }

    // cookie から token を取得
    const token = req.cookies?.token;
    // JWTチェック
    if (token) {
        try {
            // JWTを検証
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // DBからユーザーを取得
            const user = await userModel.find(decoded.id);
            if (user) {
                // session に保存
                req.session.user = user;
            }
        } catch (err) {
            console.warn("JWT invalid:", err.message);
        }
    }

    // locals に反映
    res.locals.authUser = req.session.user || null;

    next();
};

export const authRequired = (req, res, next) => {
    if (!req.session.user) {
        // session がない → ログインページへ
        return res.redirect('/login');
    }
    next();
}
