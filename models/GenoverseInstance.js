var mongoose = require('mongoose');

var GenoverseSchema = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    description: {type: String, required: true},
    genome: {type: String, required: true},
    chr: {type: String, required: true},
    start: {type: String, required: true},
    end: {type: String, required: true},
    plugins: [{type: String, required: true}],
    tracks: {type: String}
});

module.exports = mongoose.model('GenoverseInstance', GenoverseSchema);

