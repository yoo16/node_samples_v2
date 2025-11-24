import { viewDir } from '../lib/util.js';
import * as User from '../models/User.js';

export const index = async (req, res) => {
    const path = viewDir + 'login.html';
    return res.sendFile(path);
}

export const auth = async (req, res) => {
    const { email, password } = req.body;
    const result = await User.auth(email, password);

    const message = result.user ? "ログインに成功しました" : ""

    // 結果返却 JSON
    const data = {
        authUser: result.user,
        sql: result.sql,
        message,
        errors: result.errors,
    };
    res.json(data);
}