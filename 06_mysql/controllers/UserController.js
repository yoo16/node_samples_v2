import { viewDir } from '../lib/util.js';
import * as userModel from '../models/User.js';
import path from 'path';

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
    result.endpoint = req.url;
    res.json(result);
}

export const apiFind = async (req, res) => {
    const id = req.params.id;
    const result = await userModel.find(id);
    result.endpoint = req.url;
    res.json(result);
}

export const apiUpdate = async (req, res) => {
    // Multerミドルウェアで public/images/users/id.ext として保存
    const updateUser = req.body;
    const id = req.params.id;

    // 既存のユーザーを取得
    let result = await userModel.find(id);
    const existUser = result.user;
    updateUser.avatar_url = existUser.avatar_url;

    // avatar_url を生成
    if (req.file?.filename) {
        const ext = path.extname(req.file.filename);
        updateUser.avatar_url = `/images/users/${id}${ext}`;
    }

    // 更新
    result = await userModel.update(id, updateUser);

    // メッセージ
    let message = (result.errors?.length === 0) ? "更新しました" : "更新できませんでした";

    // JSON レスポンス
    const data = {
        sql: result.sql,
        endpoint: req.url,
        message,
        errors: result.errors,
    }
    res.json(data);
}