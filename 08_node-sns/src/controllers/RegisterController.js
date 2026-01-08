import userModel from "../models/User.js";

// ユーザー登録ページ
export const index = (req, res) => {
    res.render("register", {
        user: {},
        error: req.session?.error || ''
    });
    // セッションをクリア
    req.session.error = null;
};

// ユーザー登録処理
export const add = async (req, res) => {
    const { name, email, password } = req.body;

    // validation
    if (!email || !password) {
        // Render register
        return res.render("register", {
            user: { email },
            error: "メールとパスワードは必須です"
        });
    }

    // Emailチェック
    const existsUser = await userModel.findByEmail(email)
    if (existsUser && existsUser.id) {
        // セッションにエラーメッセージを Flash
        req.session.error = "そのメールアドレスは登録されています";

        // ユーザがいればユーザ登録画面へ
        return res.redirect('/register')
    }

    // ユーザ情報生成
    const newUser = { name, email, password };

    // ユーザー登録
    const isSuccess = await userModel.save(newUser);
    // console.log("isSuccess: ", isSuccess)
    // 登録成功の場合、ログインページへ
    if (isSuccess) {
        // Redirect /login
        return res.redirect("/login");
    }

    // 登録失敗の場合、ユーザ登録画面へ
    req.session.error = "登録に失敗しました";
    return res.redirect('/register')
};