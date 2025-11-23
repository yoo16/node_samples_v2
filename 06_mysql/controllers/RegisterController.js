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
    const message = result.error ? result.error : 'Register success';

    const data = {
        sql: result.sql,
        message,
        endpoint: req.url,
    }
    return res.json(data);
}