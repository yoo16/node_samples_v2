import userModel from "../models/User.js";

// ユーザー登録ページ
export const index = (req, res) => {
    res.render("register", {
        // TODO: 前回の入力値を保持: input: req.session.input || {}
        // TODO: エラーメッセージを表示: errors: req.session.errors || []
    });
    // セッションをクリア
    req.session.errors = [];
};

// ユーザー登録処理
export const add = async (req, res) => {
    // ユーザ情報生成
    const { name, email, password } = req.body;

    const newUser = { name, email, password, };
    // ユーザー登録
    const isSuccess = await userModel.save(newUser);
    // 登録成功の場合、ログインページへ
    if (isSuccess) {
        req.session.errors = [];
        req.session.input = {};
        // Redirect /login
        return res.redirect("/login");
    }

    // 登録失敗の場合、ユーザ登録画面へ
    req.session.errors = ["登録に失敗しました"];
    return res.redirect('/register')
};