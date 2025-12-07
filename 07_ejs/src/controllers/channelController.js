import Channel from '../models/channelModel.js';

const index = (req, res) => {
    // チャンネルリストを取得
    const channels = Channel.fetchAll();
    // ビューにチャンネルリストを渡す
    res.render('channel/index', {
        channels,
    });
};

const show = (req, res) => {
    // リクエストパラメータからチャンネルIDを取得
    const id = req.params.id;
    // チャンネルを取得
    const channel = Channel.find(id);
    // チャンネルが存在しない場合は、トップページにリダイレクト
    if (!channel) {
        res.redirect('/');
    }
    // ビューにチャンネルを渡す
    res.render('channel/show', {
        channel,
    });
};


export default {
    index,
    show,
};