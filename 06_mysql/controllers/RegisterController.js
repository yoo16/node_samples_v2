import { viewDir } from '../lib/util.js';
import * as userModel from '../models/User.js';

export const index = async (req, res) => {
    const path = viewDir + 'register.html';
    return res.sendFile(path);
}

export const register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        const data = {
            sql: '',
            message: 'Password not match',
            endpoint: req.url,
        }
        return res.json(data);
    }
    const result = await userModel.insert({ name, email, password });
    const message = result.errors.length > 0 ? 'ユーザ登録に失敗しました' : 'ユーザ登録に成功しました';
    console.log("errors: ", result.errors);

    const data = {
        sql: result.sql,
        message,
        errors: result.errors,
        endpoint: req.url,
    }
    return res.json(data);
}