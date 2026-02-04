import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/User.js";

/**
 * ログイン検証
 */
export async function verifyLogin(email, password) {
    // メールアドレス検証
    const user = await userModel.findByEmail(email);
    if (!user) return null;

    // パスワード検証
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // トークン発行
    const { accessToken, refreshToken } = generateTokens(user.id);

    // リフレッシュトークンDB更新
    await userModel.updateRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
}

// トークン生成
export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return { accessToken, refreshToken };
};

// Cookie保存
export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// Cookie削除
export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
};