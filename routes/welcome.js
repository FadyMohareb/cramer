var express = require('express');
var router = express.Router();

/* GET genome page. */
router.get('/', function (req, res, next) {
    if (req.user == null) {
        res.render('welcome');
    } else {
        res.render('welcome', { user: req.user });
    }
});

module.exports = router;
