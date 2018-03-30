var dir = process.cwd();
var passport = require('passport');

module.exports = {

    createGenome: function (genome) {
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
    },

    updateSpecies: function () {
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
                    require('fs').writeFile(dir + '/public/javascript/genomes/list-species.js', "module.exports = {Species :" + JSON.stringify(JSON.parse(str).species.map(function (d) {
                        return [
                            d.name, {
                                display_name: d.display_name,
                                id: d.name
                            }
                        ];
                    }).reduce(function (hash, d) {
                        hash[d[0]] = d[1];
                        return hash;
                    }, {}), null, 2) + "};", function () {
                        console.log('Species File Done');
                    });
                } catch (e) {
                    console.log(e.message);
                }
            });
        }).on('error', function (e) {
            console.log(`Got error: ${e.message}`);
        }).end();
    },

    setList: function (path, filename) {
        try {
            var list = require(path + filename);
            if (filename === "list-species.js") {
                return [null, list.Species];
            } else if (filename === "list-plugins.js") {
                return [null, list.Plugins];
            }
        } catch (err) {
            console.log(err);
            return [err, null];
        }

    },

    IsAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('warning', 'Please login to use this functionalities.');
            res.redirect('/login');
        }
    }
};