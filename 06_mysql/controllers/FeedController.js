import { viewDir } from '../lib/util.js';
import * as feedModel from '../models/Feed.js';

export const index = async (req, res) => {
    const path = viewDir + 'feed/index.html';
    return res.sendFile(path);
}

export const apiList = async (req, res) => {
    const result = await feedModel.fetchAll();
    const data = {
        feeds: result.feeds,
        sql: result.sql,
        message: 'Listed',
        errors: result.errors,
    }
    return res.json(data);
}

export const apiPost = async (req, res) => {
    console.log("posts:", req.body)
    const result = await feedModel.insert(req.body);
    const data = {
        id: result.id,
        sql: result.sql,
        message: 'Posted',
        errors: result.errors,
    }
    return res.json(data);
}

export const apiPostInjection = async (req, res) => {
    const result = await feedModel.insertInjection(req.body);
    const data = {
        id: result.id,
        sql: result.sql,
        message: 'Posted Injection',
        errors: result.errors,
    }
    return res.json(data);
}

export const apiDestroy = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const result = await feedModel.destroy(id);
    const data = {
        id: result.id,
        sql: result.sql,
        message: 'Deleted',
        errors: result.errors,
    }
    return res.json(data);
}
