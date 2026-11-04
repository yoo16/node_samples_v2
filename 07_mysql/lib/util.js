import path from 'path';
import multer from 'multer';

export const __dirname = path.resolve();
export const viewDir = path.join(__dirname, 'views/');

// 保存先のディレクトリ
const uploadDir = path.join(__dirname, '/public/images/users/');
console.log(uploadDir);

// Storage設定
const storage = multer.diskStorage({
    // どのディレクトリに保存するか
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    // 保存するファイル名をどうするか
    filename: (req, file, callback) => {
        // ユーザーID
        const id = req.params.id;
        // 拡張子
        const ext = path.extname(file.originalname);
        // ファイル名
        const filename = `${id}${ext}`;
        // コールバック
        callback(null, filename);
    },
});

// Multerインスタンスの作成
export const upload = multer({
    storage: storage,
    // ファイルサイズの制限:5MBまで
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // ファイルタイプのフィルタリング
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('許可されていないファイル形式です'), false);
        }
    }
});