var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var path = require('path');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');
var utils = require('../routes/utils.js');

/* GET users listing. */
router.get('/', utils.IsAuthenticated, function (req, res, next) {
    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/genomes/", "list-species.js");
                callback(output[0], output[1]);
            }, 10);
        },
//        genomes: function (callback) {
//            setTimeout(function () {
//                var output = utils.getGenomes();
//                callback(output[0], output[1]);
//            }, 10);
//        },
        plugins: function (callback) {
            setTimeout(function () {
                var output = utils.setList(dir + "/public/javascript/plugins/", "list-plugins.js");
                callback(output[0], output[1]);
            }, 10);
        }        
    },
            function (err, results) {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Error while loading the list of species or genomes or plugins.');
                    res.redirect('/');
                } else {
                    res.render('instance', {listSpecies: results.species, listPlugins: results.plugins});
                }

            }
    );
});

router.post('/', function (req, res, next) {

    console.log('body: ' + JSON.stringify(req.body));
    var obj = req.body;

    async.parallel({
        valideGenome: function (callback) {
            setTimeout(function () {
                if (obj.genome.type === "ensembl") {
                    var genome = obj.genome.name;
                    console.log('Genome From Ensembl');
                    var output = utils.createGenome(genome);
                    callback(output[0], output[1]);
                } else if (obj.file) {
                    file = obj.file;
                    console.log("Genome From File");
                    var output = utils.createGenomeFromFile(file.filename, file.content);
                    callback(output[0], output[1]);
                } else {
                    console.log("No genome loaded error");
                    callback("No genome loaded", false);
                }
            }, 10);
        },
        valideConfig: function (callback) {
            setTimeout(function () {
                var instance = new GenoverseInstance({
                    "name": obj.name,
                    "description": obj.description,
                    "genome": obj.genome,
                    "chr": obj.chromosome,
                    "start": obj.start,
                    "end": obj.end,
                    "plugins": obj.plugins,
                    "tracks": obj.tracks
                });
                instance.save(function (err) {
                    if (err) {
                        callback(err);
                    }
                    console.log('Instance added !');
                    callback(null, true);
                });

            }, 10);
        }
    },
            function (err, results) {
                if (err) {
                    res.end('error');
                    console.log(err);
                } else if (results.valideConfig && results.valideGenome) {
                    res.end('done');
                    console.log('Everything is alright');
                } else {
                    res.end('error');
                    console.log('Something is wrong -> Check the validGenome and valideConfig functions');
                }
            }
    );

});

module.exports = router;