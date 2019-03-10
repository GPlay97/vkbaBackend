const db = require('../utils/db');
const users = require('../modules/users');

const getUsers = async (req, res) => res.json(await users.getUsers());

const getUser = async (req, res) => res.json(await users.getUser(req.params.name));

module.exports = {
    getUsers,
    getUser
};