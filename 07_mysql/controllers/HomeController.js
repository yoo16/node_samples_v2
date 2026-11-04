import { viewDir } from '../lib/util.js';

export const home = async (req, res) => {
    const path = viewDir + 'home.html';
    return res.sendFile(path);
}
