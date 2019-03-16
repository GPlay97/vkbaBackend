const db = require('../utils/db');
const bankParser = require('../utils/bankparser');

const redeemCredits = (req, res, next) => {
    // TODO check last access to prevent too many requests
    // TODO cycle pages until no entry is left
    bankParser.getPayIns()
        .then((entries) => {
            console.log(entries);
            // TODO insert them, redeem them..
            res.json(entries);
        })
        .catch(next)
};

module.exports = {
    redeemCredits
};