import { body, validationResult } from 'express-validator';

// ユーザログイン用バリデーションルール
export const loginValidationRules = [
    body('email').isEmail().withMessage('Emailは必須です'),
    body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
];

// ユーザー登録用バリデーションルール
export const registerValidationRules = [
    body('name').notEmpty().withMessage('名前は必須です'),
    body('email').isEmail().withMessage('Emailは必須です'),
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
    return res.redirect('back');
};