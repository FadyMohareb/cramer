var express = require('express');
var router = express.Router();
var auth = require('../config/authentication.js');
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', auth.IsAuthenticated, function (req, res, next) {
    GenoverseInstance.find({name: req.query.name}, function (err, instance) {
        if (err) {
            res.send(err);
            throw err;
        } else if (instance.length) {
            console.log('Object loaded');
            res.render('modify', {object: instance[0]});
        }
    });

});
module.exports = router;
