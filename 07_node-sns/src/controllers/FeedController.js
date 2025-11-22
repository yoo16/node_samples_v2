import feedModel from "../models/Feed.js";

export const index = async (req, res) => {
    const user = req.session.user;
    const feeds = await feedModel.fetchAllWithLikes(user);
    res.render("feed/index", { feeds });
};

export const show = async (req, res) => {
    const id = req.params.id;
    const feed = await feedModel.findById(id);

    if (!feed) {
        return res.status(404).send("Feed not found");
    }

    res.render("feed/show", { feed });
};

export const search = async (req, res) => {
    const user = req.session.user;
    const keyword = req.query.keyword;

    const feeds = await feedModel.fetchAllWithLikes(user, keyword);
    res.render("feed/index", { feeds });
};

export const add = async (req, res) => {
    const user_id = req.session.user?.id;
    const content = req.body.content;

    if (!content || !user_id) {
        return res.redirect("/feed");
    }

    await feedModel.add({ content, user_id });
    res.redirect("/feed");
};