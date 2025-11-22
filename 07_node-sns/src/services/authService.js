import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/User.js";

export async function auth(email, password) {
    const user = await userModel.findByEmail(email);
    if (!user) return null;

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return null;

    // 🔥 JWT 発行（ここに集約）
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { user, token };
}

export default {
    auth,
};