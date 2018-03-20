var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {

    var User = mongoose.model('User');

    var isMatch = candidatePassword === this.password;
    cb(null, isMatch);
};

UserSchema.statics.getAuthenticated = function (email, password, cb) {

    this.findOne({ email: email }, function(err, user) {

        if (user == null) {
            console.log("Error value: " + err);
            return cb(err);
        } else {
            
            // test for a matching password
            user.comparePassword(password, function (err, isMatch) {
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