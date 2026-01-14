import userModel from "../models/User.js";
import feedModel from "../models/Feed.js";

export const index = async (req, res) => {
    const userId = req.params.id
    const user = await userModel.findById(userId);
    const feeds = await feedModel.fetchByUser(user);
    const data = { user, feeds, }
    res.render("user/index", data);
};

export const edit = async (req, res) => {
    const id = res.locals.authUser.id;
    const user = await userModel.findById(id);
    const feeds = await feedModel.fetchByUser(user);
    const data = { user, feeds }
    res.render("user/edit", data);
};

export const update = async (req, res) => {
    const id = res.locals.authUser.id;
    // POSTデータをコピー
    const updateData = { ...req.body };
    // 新しい画像がある場合、URLを更新
    if (req.file && req.file.filename) {
        updateData.avatar_url = `/images/users/${req.file.filename}`;
    } else {
        delete updateData.avatar_url;
    }
    // 更新
    const result = await userModel.update(id, updateData);
    // セッション更新
    if (result) {
        req.session.authUser = await userModel.findById(id);
    }
    return res.redirect("/user/" + id);
};