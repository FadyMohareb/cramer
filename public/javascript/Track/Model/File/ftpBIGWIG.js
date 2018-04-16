Genoverse.Track.Model.File.ftpBIGWIG = Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',

    getData: function () {
        return this.base.apply(this, arguments);
    },

    parseData: function (text, chr, s, e) {
        var fields = text.split('\t');
        var heights = fields[4].split(',');
        var start = parseInt(fields[1]);
        var features = [];
        
        for (var i = 0; i < heights.length; i++) {
            features.push({
                chr: chr,
                start: start,
                end: start + 1,
                height: parseFloat(heights[i])
            });
            start += 1;
        }
        console.log(features);
        return this.base.call(this, features, chr, s, e);
    }
});
