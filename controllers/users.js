const db = require('../utils/db');
const users = require('../modules/users');

const getUsers = async (req, res, next) => {
    try {
        const result = await users.getUsers();

        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await users.getUser(req.params.name);

        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers,
    getUser
};