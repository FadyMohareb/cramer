var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    GenoverseInstance.find({name: req.query.name}, function (err, instance) {
        if (err) {
            res.send(err);
            throw err;
        } else if (instance.length) {
            console.log('Object loaded');
            res.render('index', {object: instance[0]});
        }
    });

});
module.exports = router;
