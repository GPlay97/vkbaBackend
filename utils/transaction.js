const db = require('./db');
const errors = require('../errors.json');
const users = require('../modules/users');

const isValidTransaction = (transaction) => transaction && typeof transaction.sender === 'string' && typeof transaction.receiver === 'string' && parseFloat(transaction.amount) > 0;

const createTransactionEntry = (transaction) => db.query('insertOne', 'transactions', transaction);

const updateBalance = async (user, balance) => {
    user = await users.getUser(user);
    if ((user.balance += balance) < 0) return Promise.reject(errors.INSUFFICIENT_FUNDS);
    return db.query('updateOne', 'users', {
        filter: {
            _id: db.convertID(user._id.id)
        },
        inc: {
            balance
        }
    });
};

const createTransactionToUser = async (transaction) => {
    if (!isValidTransaction(transaction)) return Promise.reject(errors.INVALID_TRANSACTION);

    // TODO start db transaction
    // reduce amount from sender
    await updateBalance(transaction.sender, -transaction.amount);
    // add amount to receiver
    await updateBalance(transaction.receiver, transaction.amount);
    return createTransactionEntry(transaction);
};

const createTransactionToSystem = async (transaction) => {
    if (!isValidTransaction(transaction) || transaction.receiver !== '*vkba') return Promise.reject(errors.INVALID_TRANSACTION);
    // reduce amount from sender
    await updateBalance(transaction.sender, -transaction.amount);
    return createTransactionEntry(transaction);
};

const createTransactionFromSystem = async (transaction) => {
    if (!isValidTransaction(transaction) || transaction.sender !== '*vkba') return Promise.reject(errors.INVALID_TRANSACTION);
    // add amount to receiver
    await updateBalance(transaction.receiver, transaction.amount);
    return createTransactionEntry(transaction);
};

module.exports = {
    createTransactionToUser,
    createTransactionToSystem,
    createTransactionFromSystem
};