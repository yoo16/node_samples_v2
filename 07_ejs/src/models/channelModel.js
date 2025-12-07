// Dummy product data
import { channels } from '../data/testChannel.js';

const latests = () => {
    return channels.slice(0, 4);
}

const fetchAll = () => {
    return channels;
}

const find = (id) => {
    return channels.find(channel => channel.id == id);
}

export default { fetchAll, latests, find };
