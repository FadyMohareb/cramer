Genoverse.Track.Model.SNPDensity = Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',

    getData: function (chr, start, end) {
        //console.log('getting data vcfSNP');
        var deferred = $.Deferred();
        var model = this;

        if (!this.prop('gz')) {
            this.isLocal = true;
            this.dataFile = this.track.dataFile;


            return Genoverse.Track.Model.File.prototype.getData.apply(this, arguments);
            return this.base.apply(this, arguments);

        }

        if (!this.vcfFile) {

            if (this.dataFile && this.indexFile) {
                this.vcfFile = new dallianceLib.BlobFetchable(this.dataFile);
                this.tbiFile = new dallianceLib.BlobFetchable(this.indexFile);
            } else {
                return deferred.rejectWith(model, ['GZipped VCF files must be accompanied by a .tbi index file']);
            }
        }

        this.makeVCF(this.vcfFile, this.tbiFile).then(function (vcf) {

            model.cachedVCF = vcf;

            vcf.getRecords(chr, start, end, function (records) {
                model.receiveData(records, chr, start, end);
                deferred.resolveWith(model);
            });
        });

        return deferred;
    },

    makeVCF: function (vcfFile, tbiFile) {
        console.log('SNP');
        var deferred = $.Deferred();

        if (this.cachedVCF) {
            deferred.resolve(this.cachedVCF);
        } else {
            var vcf = new VCFReader(vcfFile, tbiFile);

            vcf.readTabix(function (tabix) {
                vcf.tabix = tabix;
                deferred.resolve(vcf);
            });
        }

        return deferred;
    },

    parseData: function (text, chr, s, e) {
        //console.log('parsing data vcfSNP');
        var lines = text.split('\n');
        var maxQual = this.allData ? this.prop('maxQual') || 0 : false;
        var features = [];
        for (var i = 0; i < lines.length; i++) {
            
            if (!lines[i].length || lines[i].indexOf('#') === 0) {
                continue;
            }

            var fields = lines[i].split('\t');

            if (fields.length < 5) {
                continue;
            }

            if (fields[0] == chr || fields[0] == 'chr' + chr) {
                var id = fields.slice(0, 3).join('|');
                var start = parseInt(fields[1], 10);
                var end = start + 10000;
                for (var j=start; j<end; j++){
                    features.push({
                    chr: chr,
                    start: j,
                    end: j+1,
                    height: 0
                });
                }
                var alleles = fields[4].split(',');
                if (fields[4] == fields[3]) {
                    var wt = fields[3];
                }

                alleles.unshift(fields[3]);


                var height = alleles.length;

                features.push({
                    chr: chr,
                    start: start,
                    end: end,
                    height: height
                });




                if (maxQual !== false) {
                    maxQual = Math.max(maxQual, fields[5]);
                }
            }
        }

        if (maxQual) {
            this.prop('maxQual', maxQual);
        }
        return this.base.call(this, features, chr, s, e);
    }
});




