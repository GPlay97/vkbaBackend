const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const db = require('../utils/db');
const errors = require('../errors.json');
const users = require('../modules/users');

const getUsers = async (req, res, next) => {
    try {
        res.json(await users.getUsers());
    } catch (err) {
        next(err);
    }
};

const getUser = async (req, res, next) => {
    try {
        res.json(await users.getUser(req.params.name));
    } catch (err) {
        next(err);
    }
};

const isValidRegistration = async (req, res, next) => {
    try {
        if (await users.getUser(req.params.name)) return res.json(errors.USER_ALREADY_REGISTERED);
    } catch (err) {
        if (!users.isValidPassword(req.body.password)) return res.json(errors.PASSWORD_TOO_SHORT);
        next(); // user does not exist
    }
};
const isValidLogin = async (req, res, next) => {
    try {
        if ((req.user = await users.getUser(req.params.name))) {
            if (!users.isValidPassword(req.body.password)) return res.json(errors.PASSWORD_TOO_SHORT);
            return next();
        }
    } catch (err) {
        res.json(errors.USER_NOT_REGISTERED);
    }
};

const registerUser = async (req, res, next) => {
    db.query('insertOne', 'users', {
        name: req.params.name,
        password: await bcrypt.hash(req.body.password, 10),
        balance: 0 // TODO make a transaction afterwards and add a start credit that can not be payed out
    }).then((result) => {
        auth.createToken({
            _id: db.convertID(result.insertedId.id),
            name: req.params.name
        }).then((token) => res.json({token}))
    }).catch(next)
};

const loginUser = async (req, res, next) => {
    await bcrypt.compare(req.body.password, req.user.password).then((correct) => {
        if (!correct) return next(errors.INVALID_CREDENTIALS);
        auth.createToken({
            _id: db.convertID(req.user._id.id),
            name: req.user.name
        }).then((token) => res.json({token}));
    }).catch(next);
};

module.exports = {
    getUsers,
    getUser,
    isValidRegistration,
    isValidLogin,
    registerUser,
    loginUser
};