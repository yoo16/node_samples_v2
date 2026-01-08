import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/User.js";

export async function verifyLogin(email, password) {
    // Emailで検索
    const user = await userModel.findByEmail(email);
    if (!user) return {};

    // ハッシュパスワード検証
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return {};

    // トークン生成
    const { accessToken, refreshToken } = await generateTokens(user.id);

    return { user, accessToken, refreshToken };
}

export const generateTokens = async (userId) => {
    // アクセストークン (15分)
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // リフレッシュトークン (30日)
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // DB更新
    await userModel.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
};

export default {
    verifyLogin,
    generateTokens,
};