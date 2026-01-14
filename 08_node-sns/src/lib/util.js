import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

export const __dirname = path.resolve();
// publicフォルダへの絶対パスを正しく設定
const uploadDir = path.join(__dirname, 'public/images/users/');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const userId = req.session.authUser.id;
        if (userId) {
            const ext = path.extname(file.originalname);
            const filename = `${userId}${ext}`;
            callback(null, filename);
        } else {
            callback(null);
        }
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('許可されていないファイル形式です'), false);
        }
    }
});