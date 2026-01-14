import LikeModel from "../../models/Like.js";

export const toggle = async (req, res) => {
    try {
        const feedId = req.params.id;
        const user = req.session.authUser;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Like更新（ON / OFF）
        const liked = await LikeModel.update(feedId, user.id);

        // Like数取得
        const likesCount = await LikeModel.countByFeedId(feedId);

        return res.json({
            success: true,
            liked,
            likesCount
        });

    } catch (err) {
        console.error("Like API Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};