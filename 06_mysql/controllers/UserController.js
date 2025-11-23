import { pool } from '../lib/db.js';
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
    const { name, email } = req.body;
    const id = req.params.id;
    const updateUser = {
        name,
        email,
        avatar_url: null,
    };
    const uploadFile = req.file ? req.file.filename : null;
    // avatar upload
    if (uploadFile) {
        const ext = path.extname(uploadFile);
        updateUser.avatar_url = `/images/users/${id}.${ext}`;
        const uploadDir = `public/images/users/`;

        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, uploadDir);
            },
            filename: function (req, file, callback) {
                callback(null, uploadFile);
            },
        });
        const upload = multer({ storage: storage });
        upload.single('avatar')(req, res, async (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    const result = await userModel.update(id, updateUser);
    result.endpoint = req.url;
    res.json(result);
}

