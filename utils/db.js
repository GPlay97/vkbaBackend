const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config.json');
const errors = require('../errors.json');
const logger = require('../utils/logger');

const connect = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.DB_URL, {useNewUrlParser: true})
            .then((client) => resolve(client.db(config.DB_NAME)))
            .catch((err) => {
                logger.error('Could not connect to database', err);
                reject(errors.DB_CONNECT);
            });
    });
};

const query = (type, collection, obj) => {
    return new Promise((resolve, reject) => {
        connect()
            .then((db) => {
                const allowedFnc = ['insertOne', 'updateOne', 'deleteOne', 'find'];

                if (!allowedFnc.includes(type)) return reject(errors.DB_UNKNOWN_TYPE);
                const dbCollection = db.collection(collection);

                exec(type, dbCollection, obj)
                    .then((result) => {
                        logger.debug('DB Query', result);
                        resolve(obj);
                    })
                    .catch((err) => {
                        logger.error('Error on database query', err);
                        reject(errors.DB_QUERY);
                    });
            })
            .catch((err) => reject(err));
    });
};

const exec = (fnc, collection, obj) => {
    return new Promise((resolve, reject) => {
        if (fnc === 'find') {
            collection[fnc](obj).toArray()
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        } else if (fnc === 'updateOne') {
            collection[fnc](obj.filter, { $set: obj.obj})
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        } else {
            collection[fnc](obj)
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        }
    });
};

const convertID = (id) => {
    return new ObjectID(id);
};

module.exports.query = query;
module.exports.convertID = convertID;