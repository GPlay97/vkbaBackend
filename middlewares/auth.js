const config = require('../config.json');
const errors = require('../errors.json');
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    if (typeof req.headers.authorization !== 'string') return next(errors.UNAUTHORIZED);
    jwt.verify(req.headers.authorization.split(' ')[1], config.JWT_SECRET, (err, decoded) => {
       if (!err && decoded) {
           req.user = decoded;
           next();
       } else next(errors.UNAUTHORIZED);
    });
};

const createToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.JWT_SECRET, (err, token) => {
            if (!err && token) {
                resolve(token);
            } else {
                console.error(err);
                reject(errors.JWT_SIGNING);
            }
        });
    });
};

module.exports.isAuthenticated = isAuthenticated;
module.exports.createToken = createToken;