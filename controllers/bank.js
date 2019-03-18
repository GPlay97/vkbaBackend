const bankParser = require('../utils/bankparser');
const transaction = require('../utils/transaction');

const redeemCredits = (req, res, next) => {
    // TODO check last access to prevent too many requests
    // TODO cycle pages until no entry is left
    bankParser.getPayIns()
        .then((entries) => {
            console.log(entries);

            transaction.createTransaction(entries[0])
                .then((obj) => console.log(obj))
                .catch((err) => console.error(err)); // DEMO
            // TODO insert them, redeem them..
            res.json(entries);
        })
        .catch(next)
};

module.exports = {
    redeemCredits
};