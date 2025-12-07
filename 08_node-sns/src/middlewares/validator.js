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
        // エラーがなければ次の処理（コントローラー）へ
        return next();
    }

    // エラー時のレスポンス形式を統一
    const data = {
        sql: '',
        message: '',
        errors: errors.array(),
        endpoint: req.url,
    };
    return res.json(data);
};