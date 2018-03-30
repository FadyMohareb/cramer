var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

router.get('/', utils.IsAuthenticated, function (req, res, next) {
    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/genomes/", "list-species.js");
                callback(output[0], output[1]);
            }, 10);
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

router.post('/', function (req, res, next) {

    console.log('body: ' + JSON.stringify(req.body));
    var obj = req.body;

    async.parallel({
        valideGenome: function (callback) {
            setTimeout(function () {
                var valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                if (!valideGenome) {
                    console.log('Genome Does Not Exist Yet');
                    utils.createGenome(obj.genome);
                    valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                } else {
                    console.log('Genome File Already Exists');
                }
                callback(null, true);
            }, 10);
        },
        valideConfig: function (callback) {
            setTimeout(function () {
                GenoverseInstance.find({name: obj.previous}, function (err, instance) {
                    if (err) {
                        res.send(err);
                        throw err;
                    } else if (instance.length) {
                        console.log('Object loaded');
                        console.log(instance);
                        instance[0].name = obj.name;
                        instance[0].description = obj.description;
                        instance[0].genome = obj.genome;
                        instance[0].chr = obj.chromosome;
                        instance[0].start = obj.start;
                        instance[0].end = obj.end;
                        instance[0].plugins = obj.plugins;
                        instance[0].tracks = obj.tracks;
                        console.log(instance);
                        instance[0].save(function (err) {
                            if (err) {
                                throw err;
                                callback(err);
                            }
                            console.log('Instance modified !');
                            callback(null, true);
                        });
                    }
                });

            }, 10);
        }
    },
            function (err, results) {
                if (results.valideConfig && results.valideGenome) {
                    res.end('done');
                    console.log('Everything is alright -> Open the index page');
                } else {
                    res.end('error');
                    console.log('Something is wrong -> Check the createGenome or writeConfig functions');
                }
            }
    );

});
module.exports = router;
