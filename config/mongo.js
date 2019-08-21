var mongoose = require('mongoose');

module.exports = {
    init: function () {
        mongoose.connect(process.env.MONGODB_URL);
        var db = mongoose.connection;
        db.on('error', function (err) {
            if (err) {
                console.log('Connection to the database failed', err);
            } else {
                console.log('Connection to the database success');
            }
        });

        db.once('open', function () {
            console.log('MongoDB connection open');
        });

    }
};
