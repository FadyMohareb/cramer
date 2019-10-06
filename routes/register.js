/**
 * There is no way to create a user via the application
 * Therefore if you want to create user. Use postman or something similar
 * How To Do:
 * Select 'POST'
 * Set the URL to: http://localhost:4000/register
 * Add the Body (raw)
    {
 	"name": "TEST",
 	"email": "test@test.fr",
	"password": "test"
    }
 * Click 'Send'
 * Your User is created with a hash password
 * 
 * /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\
 * Do not forget to uncomment the route to register a user in app.js.
 *             When you finished, comment the route again.
 * /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User.js');

/**
 * POST register
 */
router.post('/', function (req, res, next) {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    User.createUser(newUser, function (err, user) {
        if (err) {
            console.log(err);
            res.status(404).send('Error while creating the user: ' + err);
        }
        res.status(200).send(user);
    });
});

module.exports = router;
