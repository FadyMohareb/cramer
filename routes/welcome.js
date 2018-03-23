var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
//    var test = new GenoverseInstance({
//        "name": "Test3",
//        "description": "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
//        "genome": "grch38",
//        "chr": "9",
//        "start": "150",
//        "end": "250",
//        "plugins": ["controlPanel", "karyotype", "trackControls", "resizer", "focusRegion", "fullscreen", "tooltips", "selectChromosome", "search", "fileDrop"],
//        "tracks": ""
//
//    });
//    test.save(function (err) {
//        if (err) {
//            throw err;
//        }
//        console.log('Commentaire ajouté avec succès !');
//    });
    GenoverseInstance.find(null, function (err, genoverseInstances) {
        if (err) {
            res.send(err);
            throw err;
        } else if (genoverseInstances.length) {
            console.log('List of instances loaded');

            if (req.user === null) {
                res.render('welcome', {listInstances: genoverseInstances});
            } else {
                res.render('welcome', {user: req.user, listInstances: genoverseInstances});
            }
        } else {
            res.send('No genoverse instances found');
        }

    });
});

router.get('/logout', function (req, res, next) {
    req.logout();
    console.log('Log out');
    res.redirect('/');
});

module.exports = router;
