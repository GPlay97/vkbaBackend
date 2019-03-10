const db = require('../utils/db');
const logger = require('../utils/logger');

const getUsers = async () => {
    return db.query('find', 'users', {})
        .then((users) => {
            return users;
        })
        .catch((err) => {
            logger.error('Could not get users', {
                err
            });
            return [];
        });
};

module.exports = {
    getUsers
};