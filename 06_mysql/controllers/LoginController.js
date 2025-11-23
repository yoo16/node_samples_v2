import { viewDir } from '../lib/util.js';
import { auth } from '../models/User.js';

export const index = async (req, res) => {
    const path = viewDir + 'login.html';
    return res.sendFile(path);
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await auth(email, password);
    const authUser = result.user;
    const sql = result.sql;

    let message = "";
    let errors = [];
    if (authUser) {
        message = "ログインに成功しました"
    } else {
        errors.push({ msg: "ログインに失敗しました" });
    }
    // 結果返却 JSON
    const data = {
        authUser,
        sql,
        endpoint: req.url,
        message,
        errors,
    };
    res.json(data);
}