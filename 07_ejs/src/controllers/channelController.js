import Channel from '../models/channelModel.js';

const index = (req, res) => {
    const channels = Channel.fetchAll();
    res.render('channel/index', {
        channels,
    });
};

const show = (req, res) => {
    const id = req.params.id;
    console.log(id);
    const channel = Channel.find(id);
    console.log(channel)
    // if (!channel) {
    //     res.redirect('/');
    // }
    res.render('channel/show', {
        channel,
    });
};


export default {
    index,
    show,
};