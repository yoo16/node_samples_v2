import { viewDir } from '../lib/util.js';
import * as userModel from '../models/User.js';

export const index = async (req, res) => {
    const path = viewDir + 'register.html';
    return res.sendFile(path);
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    // 既存メールアドレスチェック
    const { user, sql } = await userModel.findByEmail(email);
    console.log("Exist User: ", user);
    if (user) {
        const data = {
            sql,
            message: '',
            errors: [{ msg: 'メールアドレスは既に登録されています' }],
        }
        return res.json(data);
    }

    // ユーザ登録
    const result = await userModel.insert({ name, email, password });
    const message = result.errors.length === 0 ? 'ユーザ登録に成功しました' : '';

    const data = {
        sql: result.sql,
        message,
        errors: result.errors,
    }
    return res.json(data);
}