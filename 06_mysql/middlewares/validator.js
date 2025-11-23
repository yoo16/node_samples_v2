import { body, validationResult } from 'express-validator';

// ルールを定義
export const registerValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('confirm_password').custom((value, { req }) => {
        console.log(value, req.body.password);
        if (value !== req.body.password) {
            return false;
        }
        return true;
    }).withMessage('Password confirmation does not match password'),
];

// エラーがあればレスポンスを返すミドルウェア
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        // エラーがなければ次の処理（コントローラー）へ
        return next();
    }

    console.log(errors)
    // エラー時のレスポンス形式を統一
    const data = {
        sql: '',
        message: '入力が正しくありません',
        errors: errors.array(),
        endpoint: req.url,
    };
    return res.json(data);
};