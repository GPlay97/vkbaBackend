const db = require('../utils/db');
const errors = require('../errors.json');
const logger = require('../utils/logger');

const getUsers = async () => {
    return db.query('find', 'users', {})
        .then((users) => users)
        .catch((err) => {
            logger.error('Could not get users', err);
            return Promise.reject(err);
        });
};

const getUser = async (name) => {
    return db.query('find', 'users', {
        name
    })
        .then((user) => user[0] || Promise.reject(errors.NOT_FOUND))
        .catch((err) => {
            logger.warn('Could not get user', err);
            return Promise.reject(err);
        });
};

module.exports = {
    getUsers,
    getUser
};