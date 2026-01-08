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
    const posts = req.body;
    if (req.file) {
        posts.avatar_url = `/images/users/${req.file.filename}`;
    }
    await userModel.update(id, posts);
    return res.redirect("/user");
};