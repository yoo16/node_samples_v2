import { viewDir } from '../lib/util.js';
import * as userModel from '../models/User.js';

export const index = async (req, res) => {
    const path = viewDir + 'user/index.html';
    return res.sendFile(path);
}

export const edit = async (req, res) => {
    const path = viewDir + 'user/edit.html';
    return res.sendFile(path);
}

// API
export const apiList = async (req, res) => {
    const result = await userModel.fetchAll();
    res.json(result);
}

export const apiFind = async (req, res) => {
    const id = req.params.id;
    const result = await userModel.find(id);
    res.json(result);
}

export const apiUpdate = async (req, res) => {
    // 更新内容
    const updateUser = req.body;
    // ユーザID 
    const id = req.params.id;

    // 更新
    const result = await userModel.update(id, updateUser);

    // メッセージ
    const message = (result.errors?.length === 0) ? "更新しました" : "更新できませんでした";

    // JSON レスポンス
    const data = {
        sql: result.sql,
        message,
        errors: result.errors,
    }
    res.json(data);
}