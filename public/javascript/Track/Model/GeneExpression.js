Genoverse.Track.Model.GeneExpression = Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',
    gfffeatures: genePositions = [genes = [], startPos = [], endPos = []],
    gffdata: '',

    getData: function (chr) {
        console.log("getData" + chr);
        if (!this.url) {
            this.isLocal = true;
            this.dataFile = this.track.dataFile;
            this.indexFile = this.track.indexFile;

            if (this.indexFile) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    this.gffdata = e.target.result;
                    var lines = this.gffdata.split('\n');
                    console.log(lines.length);
                    var fields;
                    for (var i = 0; i < lines.length; i++) {
                        if (!lines[i].length || lines[i].indexOf('#') === 0) {
                            continue;
                        }
                        fields = lines[i].split('\t');

                        var seqId = fields[0].toLowerCase();
                        if (
                                seqId == chr ||
                                seqId == 'chr' + chr ||
                                seqId.match('[^1-9]' + chr + '$') ||
                                seqId.match('^' + chr + '\\b')
                                ) {
                            genes.push(fields[8]);
                            startPos.push(fields[3]);
                            endPos.push(fields[4]);
                        }
                    }
                    console.log("reading again");
                };


                reader.readAsText(this.indexFile);
            }

            return Genoverse.Track.Model.File.prototype.getData.apply(this, arguments);
        }

        return this.base.apply(this, arguments);

    },

    parseData: function (text, chr, s, e) {

        var track = this;

        setTimeout(function () {
            console.log('reading rsem file');

            var lines2 = text.split('\n');
            var fields2;
            var expected_counts;
            var IDS;

            // console.log("going through parsing");
            for (var i = 0; i < lines2.length; i++) {
                if (!lines2[i].length === 0) {
                    continue;
                }
                fields2 = lines2[i].split('\t');

                IDS = fields2[0];
                expected_counts = fields2[4];
                // if (expected_counts <= 20) {
                //continue;
                //}
                //console.log(expected_counts);

                for (var j = 0; j < genes.length; j++) {
                    // console.log("looping through genes id array");
                    if (IDS !== '' && genes[j].includes(IDS)) {
                        //console.log(IDS);
                        track.insertFeature({

                            id: IDS,
                            chr: chr,
                            start: parseInt(startPos[j]),
                            end: parseInt(endPos[j]),
                            height: parseFloat(expected_counts)

                        });

                        console.log("inserting features");

                    }

                }

            }
        }, 10000);

    }

});

