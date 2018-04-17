Genoverse.Track.Model.File.GFF = Genoverse.Track.Model.File.extend({
    typeMap: {
        exon: 'exon',
        cds: 'cds'
    },

    parseData: function (text, chr) {
        var track = this;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; i++) {
            if (!lines[i].length || lines[i].indexOf('#') === 0)
                continue;

            var fields = lines[i].split("\t");

            if (fields.length < 5)
                continue;
            if (fields[0] == chr || fields[0].toLowerCase() == 'chr' + chr || fields[0].match('[^1-9]' + chr + '$')) {
                var feature = {};

                if (fields[8]) {
                    var frame = fields[8].split(';');
                    for (var j = 0; j < frame.length; j++) {
                        var keyValue = frame[j].split('=');
                        if (keyValue.length == 2)
                            feature[keyValue[0].toLowerCase()] = keyValue[1];
                    }
                }
                
                feature.chr = chr;
                feature.start = fields[3] * 1;
                feature.end = fields[4] * 1;
                feature.id = feature.id || fields.slice(0, 5).join("|");
                feature.source = fields[1];
                feature.type = fields[2];
                feature.score = fields[5];
                feature.strand = fields[6] + '1';

                // sub-feature came earlier than parent feature
                if (feature.parent && !this.featuresById[feature.parent]) {
                    this.featuresById[feature.parent] = {
                        exons: [],
                        cds: []
                    };
                }

                if (feature.parent && feature.type.toLowerCase() == this.typeMap.exon.toLowerCase()) {
                    if (!$.grep(this.featuresById[feature.parent].exons, function (exon) {
                        return exon.id == feature.id
                    }).length) {
                        this.featuresById[feature.parent].exons.push(feature);
                    }
                } else if (feature.parent && feature.type.toLowerCase() == this.typeMap.cds.toLowerCase()) {
                    if (!$.grep(this.featuresById[feature.parent].cds, function (exon) {
                        return exon.id == feature.id
                    }).length) {
                        this.featuresById[feature.parent].cds.push(feature);
                    }
                } else if (!feature.parent) {
                    feature.label = feature.name || feature.id || '';
                    $.extend(feature, {label: feature.name || feature.id || '', exons: [], cds: []}, this.featuresById[feature.id] || {});
                    delete this.featuresById[feature.id];
                    track.insertFeature(feature);
                }
            }
        }
    }

});

Genoverse.Track.Model.File.GTF = Genoverse.Track.Model.File.GFF;
