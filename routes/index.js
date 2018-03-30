var express = require('express');
var router = express.Router();
var fs = require('fs');
var dir = process.cwd();
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
    GenoverseInstance.find({name: req.query.name}, function (err, instance) {
        if (err) {
            console.log(err);
            req.flash('error', 'Error while finding the instance in the database.');
            res.redirect('/');
        } else if (instance.length) {
            if (fs.existsSync(dir + '/public/javascript/genomes/' + instance[0].genome + '.js')) {
                console.log('Object loaded');
                res.render('index', {object: instance[0]});
            } else {
                console.log('Genome file does not exist');
                req.flash('error', 'Genome file does not exist.');
                res.redirect('/');
            }

        }
    });

});
module.exports = router;
