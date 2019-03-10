const db = require('../utils/db');
const users = require('../modules/users');

const getUsers = async (req, res, next) => {
    res.json(await users.getUsers());
};

module.exports = {
    getUsers
};