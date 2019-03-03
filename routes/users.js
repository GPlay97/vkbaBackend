const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res, next) => {
    db.query('find', 'users', {})
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
});

router.post('/', (req, res, next) => {
    db.query('insertOne', 'users', {
        name: req.body.name
    })
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
});

router.put('/:name', (req, res, next) => {
    db.query('find', 'users', {
        name: req.params.name
    })
        .then((result) => {
            const id = db.convertID(result[0]._id);
            console.log({id});
            db.query('updateOne', 'users', {
                    filter: {
                        _id: id
                    },
                    obj: {
                        name: req.body.name
                    }
                }
            )
                .then((result) => res.json(result))
                .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
});

router.delete('/:name', (req, res, next) => {
    db.query('find', 'users', {
        name: req.params.name
    })
        .then((result) => {
            db.query('deleteOne', 'users', {
                _id: db.convertID(result[0]._id)
            })
                .then((result) => res.json(result))
                .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
});

module.exports = router;
