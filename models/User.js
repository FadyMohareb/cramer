const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

UserSchema.methods.comparePassword = function (candidatePassword, hash, cb) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) {
            cb(err, null);
        }
        cb(null, isMatch);
    });
}

UserSchema.statics.getAuthenticated = function (email, password, cb) {

    this.findOne({ email: email }, function (err, user) {
        if (err)
            return cb(err);

        if (user == null) {
            console.log("Error value: " + err);
            return cb(err);
        } else {

            // test for a matching password
            user.comparePassword(password, user.password, function (err, isMatch) {
                if (err)
                    return cb(err, null);

                // check if the password was a match
                if (isMatch) {
                    return cb(null, user);
                } else {
                    return cb(null, null);
                }

            });
        }

    });
};

/**
 * Register UserSchema
 */
module.exports = mongoose.model('User', UserSchema);

/**
 * Function to create a user
 */
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}