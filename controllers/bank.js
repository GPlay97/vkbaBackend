const db = require('../utils/db');
const bankParser = require('../utils/bankparser');
const transaction = require('../utils/transaction');

const redeemCredits = (req, res, next) => {
    // TODO check last access to prevent too many requests
    // TODO cycle pages until no entry is left
    bankParser.getPayIns()
        .then(async (entries) => {
            console.log(entries);
            res.json(entries);

            let transactions = [];

            for (const entry of entries) {
                const foundTransaction = await db.query('find', 'transactions', {
                    timestamp: entry.timestamp,
                    sender: entry.sender,
                    receiver: entry.receiver,
                    amount: entry.amount
                }).catch(() => null);

                if (!foundTransaction[0]) transactions.push(transaction.createTransactionFromSystem(entry).catch(() => null));
            }
            return Promise.all(transactions).catch(next);
        })
        .catch(next)
};

module.exports = {
    redeemCredits
};