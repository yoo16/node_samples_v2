import { body, validationResult } from 'express-validator';
import userModel from '../models/User.js';

// ユーザログイン用バリデーションルール
export const loginValidationRules = [
    body('email').isEmail().withMessage('Emailを正しく入力してください'),
    body('password').isLength({ min: 6 }).withMessage('パスワードを正しく入力してください'),
];

// ユーザー登録用バリデーションルール
export const registerValidationRules = [
    body('name').notEmpty().withMessage('名前を正しく入力してください'),
    body('email').isEmail().withMessage('Emailを正しく入力してください')
        .custom(async (value) => {
            // Email重複チェック
            const user = await userModel.findByEmail(value);
            if (user) {
                throw new Error('Emailは既に登録されています');
            }
        }),
    body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            return false;
        }
        return true;
    }).withMessage('確認用パスワードが一致しません'),
];

// エラーがあればレスポンスを返すミドルウェア
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const messages = errors.array().map(err => err.msg);
    req.session.errors = messages;
    req.session.input = req.body;
    const backURL = req.get('Referer');
    return res.redirect(backURL);
};