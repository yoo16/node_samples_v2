import userModel from "../models/User.js";

// ユーザー登録ページ
export const index = (req, res) => {
    res.render("register", {
        user: {},
        error: ''
    });
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
        // ユーザがいればユーザ登録画面へ
        return res.render("register", {
            user: { name, email },
            error: "そのメールアドレスは登録されています"
        });
    }

    // 新規ユーザー
    const newUser = { name, email, password };
    // ユーザー登録
    const userId = await userModel.save(newUser);
    console.log(userId)
    if (userId) {
        // Redirect /login
        return res.redirect("/login");
    }

    // Render register
    res.render("register", {
        user: newUser,
        error: "登録に失敗しました"
    });
};