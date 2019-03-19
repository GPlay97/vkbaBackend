const bankParser = require('../utils/bankparser');
const transaction = require('../utils/transaction');

const redeemCredits = (req, res, next) => {
    // TODO check last access to prevent too many requests
    // TODO cycle pages until no entry is left
    bankParser.getPayIns()
        .then((entries) => {
            console.log(entries);
            res.json(entries);
            // TODO check if entry already credited
            Promise.all(entries.map((entry) => transaction.createTransactionFromSystem(entry)))
                .catch(() => null);
        })
        .catch(next)
};

module.exports = {
    redeemCredits
};