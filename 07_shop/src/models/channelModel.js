// mock data
import { channels } from '../data/testChannel.js';

const Channel = () => {
    let items = channels || [];

    const latests = (limit = 3) => {
        return items.slice(0, limit);
    }

    const fetchAll = () => {
        return items;
    }

    const find = (id) => {
        return items.find(channel => channel.id == id);
    }

    return {
        latests,
        fetchAll,
        find
    };
}

export default Channel;
