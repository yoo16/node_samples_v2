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
export const fetchAll = async (req, res) => {
    const result = await userModel.fetchAll();
    result.endpoint = req.url;
    res.json(result);
}

export const find = async (req, res) => {
    const id = req.params.id;
    const result = await userModel.find(id);
    result.endpoint = req.url;
    res.json(result);
}

export const update = async (req, res) => {
    // Multerミドルウェアで public/images/users/id.ext として保存
    const { name, email } = req.body;
    const id = req.params.id;

    // avatar_url を生成
    let avatar_url = null;
    if (req.file) {
        // req.file.filename : ${id}.${ext}
        const ext = path.extname(req.file.filename);
        avatar_url = `/images/users/${id}${ext}`;
    }

    const updateUser = {
        name,
        email,
        avatar_url,
    };

    // 更新
    const result = await userModel.update(id, updateUser);

    // メッセージ
    let message = "";
    if (result.errors?.length === 0) {
        message = "更新しました";
    }

    // JSON レスポンス
    const data = {
        sql: result.sql,
        endpoint: req.url,
        message,
        errors: result.errors,
    }
    res.json(data);
}