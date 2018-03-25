var express = require('express');
var router = express.Router();
var async = require('async');
var dir = process.cwd();
var auth = require('../config/authentication.js');
var fs = require('fs');
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET users listing. */
router.get('/', auth.IsAuthenticated, function (req, res, next) {

    async.parallel({
        species: function (callback) {
            setTimeout(function () {
                fs.readFile(dir + '/public/javascript/genomes/list-species.json', 'utf8', function (err, data) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log("List species loaded");
                    callback(null, JSON.parse(data));
                });
            }, 10);
        },
        plugins: function (callback) {
            setTimeout(function () {
                fs.readFile(dir + '/public/javascript/plugins/list-plugins.json', 'utf8', function (err, data) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log("List plugins loaded");
                    callback(null, JSON.parse(data));
                });
            }, 10);
        },
    },
            function (err, results) {
                if (err) {
                    req.flash('error', 'Error while loading the list plugins or the list species.');
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
                var valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                if (!valideGenome) {
                    console.log('Genome Does Not Exist Yet');
                    createGenome(obj.genome);
                    valideGenome = fs.existsSync(dir + '/public/javascript/genomes/' + obj.genome + '.js');
                } else {
                    console.log('Genome File Already Exists');
                }
                callback(null, true);
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
                    "tracks": ""
                });
                instance.save(function (err) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    console.log('Instance added !');
                    callback(null, true);
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

function createGenome(genome) {
    console.log('Write the genome file');
    // Create a genome file from the Ensembl REST API
    require('http').get({
        hostname: 'rest.ensembl.org',
        path: '/info/assembly/' + genome + '?bands=1',
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            try {
                require('fs').writeFile(dir + '/public/javascript/genomes/' + genome + '.js', 'Genoverse.Genomes.' + genome + ' = ' + JSON.stringify(JSON.parse(str).top_level_region.filter(function (d) {
                    return d.coord_system === 'chromosome';
                }).map(function (d) {
                    return [
                        d.name, {
                            size: d.length,
                            bands: (d.bands || [{start: 1, end: d.length}]).map(function (b) {
                                return {id: b.id, start: b.start, end: b.end, type: b.stain};
                            })
                        }
                    ];
                }).reduce(function (hash, d) {
                    hash[d[0]] = d[1];
                    return hash;
                }, {}), null, 2), function () {
                    console.log('Genome File Done');
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', function (e) {
        console.log(`Got error: ${e.message}`);
    }).end();
}

function updateSpecies() {
    console.log('Write all the species in a file');
// Create a species file for the Ensembl REST API
    require('http').get({
        hostname: 'rest.ensembl.org',
        path: '/info/species?',
        headers: {'Content-Type': 'application/json'}
    }, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            try {
                require('fs').writeFile(dir + '/public/javascript/genomes/list-species.json', JSON.stringify(JSON.parse(str).species.map(function (d) {
                    return [
                        d.name, {
                            display_name: d.display_name,
                            id: d.name
                        }
                    ];
                }).reduce(function (hash, d) {
                    hash[d[0]] = d[1];
                    return hash;
                }, {}), null, 2), function () {
                    console.log('Species File Done');
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', function (e) {
        console.log(`Got error: ${e.message}`);
    }).end();
}

module.exports = router;