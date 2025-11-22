
const mockFeeds = [];

// 全ユーザーデータ取得
export const initPost = () => {
    const data = {
        id: '',
        userId: '',
        content: '',
        timestamp: ''
    };
    return data;
};

// 全データ取得
export const fetchAll = () => {
    // TODO: DB から取得
    return mockFeeds;
};

// ID でデータ検索
export const findById = (id) => {
    console.log(id)
    // TODO: DB から取得
    return mockFeeds.find(feed => feed.id == id);
};

// キーワードでデータ検索
export const search = (keyword) => {
    // TODO: DB から取得
    return mockFeeds.filter(post => post.content.includes(keyword));
};

// ユーザーデータ保存
export const update = (newPost) => {
    // TODO: DB 書き込み処理
};

export const toggleLike = (feedId, userId) => {
    const feed = findById(feedId);
    if (!feed) return { success: false };

    // likesが未定義なら初期化
    if (!Array.isArray(feed.likes)) feed.likes = [];

    // すでにいいね済みか確認
    const index = feed.likes.indexOf(userId);
    const alreadyLiked = index !== -1;

    if (alreadyLiked) {
        // いいね解除（配列から削除）
        feed.likes.splice(index, 1);
    } else {
        // いいね追加
        feed.likes.push(userId);
    }

    // TODO: DB 書き込み処理
    // 保存処理があるならここで実行（DB更新など）
    // save(feed);

    return {
        success: true,
        liked: !alreadyLiked,
        likesCount: feed.likes.length
    };
};


export default {
    initPost,
    fetchAll,
    findById,
    update,
    search,
    toggleLike,
};