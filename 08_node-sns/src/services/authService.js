import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/User.js";

/**
 * ログイン検証
 */
export async function verifyLogin(email, password) {
    const user = await userModel.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
}

/**
 * トークン生成系 (同期処理)
 */
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


/**
 * 検証系 (同期処理)
 */
export const verifyToken = (token) => {
    try {
        // jwt.verify は同期的に値を返すため await 不要
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};