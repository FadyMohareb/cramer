var express = require('express');
var router = express.Router();
var GenoverseInstance = require('../models/GenoverseInstance.js');
var User = require('../models/User.js');
var utils = require('../routes/utils.js');

/* GET genome page. */
router.get('/', function (req, res, next) {

    utils.updateSpecies();
    
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


//
//var test = new GenoverseInstance(
//        {
//            "name": "Zulu",
//            "description": "Isebenza kanjani?",
//            "genome": "grch38",
//            "chr": "8",
//            "start": "3500000",
//            "end": "3500009",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": false, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": false, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "French",
//            "description": "Comment ça marche",
//            "genome": "grch38",
//            "chr": "15",
//            "start": "150",
//            "end": "250",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": true, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "English",
//            "description": "How it works ?",
//            "genome": "grch38",
//            "chr": "2",
//            "start": "2500000",
//            "end": "2500002",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": false, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": false, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "Spanish",
//            "description": "Como funciona ?",
//            "genome": "grch38",
//            "chr": "12",
//            "start": "20000",
//            "end": "30000",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": true, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "Polish",
//            "description": "Jak to działa?",
//            "genome": "grch38",
//            "chr": "5",
//            "start": "3500000",
//            "end": "3500009",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": false, "id": "resizer"},
//                {"name": "Focus Region", "checked": false, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": true, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "Hindi",
//            "description": "यह कैसे काम करता है?",
//            "genome": "grch38",
//            "chr": "3",
//            "start": "3500000",
//            "end": "3500009",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": true, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        },
//        {
//            "name": "Arabic",
//            "description": "كيف يعمل؟",
//            "genome": "grch38",
//            "chr": "9",
//            "start": "1",
//            "end": "3500000",
//            "plugins": [
//                {"name": "Control Panel", "checked": true, "id": "controlPanel"},
//                {"name": "Karyotype", "checked": true, "id": "karyotype"},
//                {"name": "Track Controls", "checked": true, "id": "trackControls"},
//                {"name": "Resizer", "checked": true, "id": "resizer"},
//                {"name": "Focus Region", "checked": true, "id": "focusRegion"},
//                {"name": "Tooltips", "checked": true, "id": "tooltips"},
//                {"name": "Select Chromosome", "checked": true, "id": "selectChromosome"},
//                {"name": "Search", "checked": true, "id": "search"},
//                {"name": "File Drop", "checked": true, "id": "fileDrop"}
//            ],
//            "tracks": [
//                {group: "basic", name: "Scalebar", description: "Display the scalebar", data: "Genoverse.Track.Scalebar"},
//                {group: "basic", name: "Scaleline", description: "Display the scaleline", data: "Genoverse.Track.Scaleline"}
//            ]
//        }
//);
//test.save(function (err) {
//    if (err) {
//        throw err;
//    }
//    console.log('Commentaire ajouté avec succès !');
//});
//
//var test = new User({
//    name: "Tomasz",
//    email: "tomasz@cranfield.ac.uk",
//    password: "qwerty"
//});
//test.save(function (err) {
//    if (err) {
//        throw err;
//    }
//    console.log('Commentaire ajouté avec succès !');
//});