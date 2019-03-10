const db = require('../utils/db');
const logger = require('../utils/logger');

const getUsers = async () => {
    return db.query('find', 'users', {})
        .then((users) => users)
        .catch((err) => {
            logger.error('Could not get users', {
                err
            });
        });
};

const getUser = async (name) => {
    return db.query('find', 'users', {
        name
    })
        .then((user) => user[0])
        .catch((err) => {
            logger.error('Could not get user', {
                err
            });
        });
};

module.exports = {
    getUsers,
    getUser
};