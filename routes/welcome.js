var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');

/* GET genome page. */
router.get('/', function (req, res, next) {
//    var test = new GenoverseInstance({
//        "name": "Test4",
//        "description": "CCCCCCCCC",
//        "genome": "grch38",
//        "chr": "9",
//        "start": "150000",
//        "end": "150004",
//        "plugins": ["controlPanel", "karyotype", "trackControls", "resizer", "focusRegion", "fullscreen", "tooltips", "selectChromosome", "search", "fileDrop"],
//        "tracks": [
//            {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//            {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//        ]
//    });
    test.save(function (err) {
        if (err) {
            throw err;
        }
        console.log('Commentaire ajouté avec succès !');
    });
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
            res.render('welcome');
        }

    });
});

router.get('/logout', function (req, res, next) {
    req.logout();
    console.log('Log out');
    res.redirect('/');
});

module.exports = router;
