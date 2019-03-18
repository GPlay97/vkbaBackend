const db = require('./db');
const errors = require('../errors.json');
const users = require('../modules/users');

const createTransaction = async (transaction) => {
    if (!transaction || typeof transaction.sender !== 'string' || typeof transaction.receiver !== 'string' || !parseFloat(transaction.amount)) {
        return Promise.reject(errors.INVALID_TRANSACTION);
    }
    const sender = await users.getUser(transaction.sender);
    const receiver = await users.getUser(transaction.receiver);

    return Promise.resolve({
        sender,
        receiver
    });
};

module.exports = {
    createTransaction
};