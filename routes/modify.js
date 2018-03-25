var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var auth = require('../config/authentication.js');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');

router.get('/', auth.IsAuthenticated, function (req, res, next) {
    async.parallel({
        species: function (callback) {
            fs.readFile(dir + '/public/javascript/genomes/list-species.json', 'utf8', function (err, data) {
                if (err) {
                    throw err;
                    callback(err);
                }
                console.log('Species loaded');
                callback(null, JSON.parse(data));
            });
        },
        instance: function (callback) {
            GenoverseInstance.find({name: req.query.name}, function (err, instance) {
                if (err) {
                    throw err;
                } else if (instance.length) {
                    console.log('Instance loaded');
                    callback(null, instance);
                }
            });
        }
    },
            function (err, results) {
                if (err) {
                    res.render('error');
                } else {
                    res.render('modify', {object: results.instance[0], listSpecies: results.species});
                }

            });


});
module.exports = router;
