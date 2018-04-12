Genoverse.Track.Model.File.ftpBAM = Genoverse.Track.Model.File.extend({
    getData: function (chr, start, end) {
        var deferred = $.Deferred();
        var model = this;

        if (!this.prop('gz')) {
            return this.base.apply(this, arguments);
        }
        
        return deferred;
    },

    insertFeature: function (feature) {

        feature.id = feature.chr + ':' + feature.readName + ':' + feature.pos;
        feature.start = feature.pos + 1;
        feature.end = feature.start + feature.seq.length;
        feature.sequence = feature.seq;

        return this.base(feature);
    },

    parseData: function (text, chr) {
        var lines = text.split('\n');

        for (var i = 0; i < (lines.length-1); i++) {

            var fields = lines[i].split('\t');       
            var feature = {
                chr: chr,
                readName: fields[0],
                pos: fields[3]-1,
                seq: fields[9]
            };
            this.insertFeature(feature);
        }
    }
});
