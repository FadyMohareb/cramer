var mongoose = require('mongoose');

var track = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    data: {type: String}
});

var trackSchema = new mongoose.Schema({
    group: {type: String, required: true},
    checked: Boolean,
    trackChildren: [track]
});

var pluginSchema = new mongoose.Schema({
    "name": {type: String, required: true},
    "checked": Boolean,
    "id": {type: String, required: true}
});

var genomeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true}
});

var GenoverseSchema = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    description: {type: String, required: true},
    genome: genomeSchema,
    chr: {type: String, required: true},
    start: {type: String, required: true},
    end: {type: String, required: true},
    plugins: [pluginSchema],
    tracks: [trackSchema]
});

module.exports = mongoose.model('GenoverseInstance', GenoverseSchema);

