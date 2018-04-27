Genoverse.Track.Model.SNPDensity = Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',
    binSize: 1000000,

    getData: function (chr, start, end) {
        var deferred = $.Deferred();

        return this.base.apply(this, arguments);

        return deferred;
    },

    parseData: function (text, chr, s, e) {
        var lines = text.split('\n');
        var features = [];
        var binSize = this.binSize;
        for (var j = s; j < e; j+= this.binSize/1000) {
                    features.push({
                        chr: chr,
                        start: j,
                        end: j + this.binSize/1000,
                        height: 0
                    });
                }
                
        for (var i = 0; i < lines.length; i++) {

            if (!lines[i].length || lines[i].indexOf('#') === 0) {
                continue;
            }

            var fields = lines[i].split('\t');

            if (fields.length < 5) {
                continue;
            }

            if (fields[0] == chr || fields[0] == 'chr' + chr) {
                
                
                var start = parseInt(fields[1], 10);
                var alleles = fields[4].split(',');
                
                alleles.unshift(fields[3]);

                var height = alleles.length;

                features.push({
                    chr: chr,
                    start: start - (binSize/2),
                    end: start + (binSize/2),
                    height: height
                });
            }
        }
        return this.base.call(this, features, chr, s, e);
    }
});




