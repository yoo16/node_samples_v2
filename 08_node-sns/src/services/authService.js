import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/User.js";

export async function auth(email, password) {
    // Emailで検索
    const user = await userModel.findByEmail(email);
    // ユーザがいなければ、空白オブジェクト
    if (!user) return {};

    // ハッシュパスワード
    const isAuth = await bcrypt.compare(password, user.password);
    // 認証失敗で、空白オブジェクト
    if (!isAuth) return {};

    // 🔥 JWT 発行
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    console.log("token: ", token)
    return { user, token };
}

export default {
    auth,
};