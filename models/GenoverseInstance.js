var mongoose = require('mongoose');

var GenoverseSchema = new mongoose.Schema({
    container: String,
    genome: String,
    chr: String,
    start: String,
    end: String,
    plugins: String,
    tracks: String
});

module.exports = mongoose.model('GenoverseInstance', GenoverseSchema);

