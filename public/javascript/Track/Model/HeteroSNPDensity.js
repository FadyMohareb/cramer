Genoverse.Track.Model.HeteroSNPDensity= Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',
    
  getData: function (chr, start, end) {
      //console.log('getting data vcfSNP');
    var deferred = $.Deferred();
    var model    = this;

    if (!this.prop('gz')) {
        this.isLocal  = true;
      this.dataFile = this.track.dataFile;
     

      return Genoverse.Track.Model.File.prototype.getData.apply(this, arguments);
      return this.base.apply(this, arguments);
    
    }

    if (!this.vcfFile) {
        
      if (this.url) {
        this.vcfFile = new dallianceLib.URLFetchable(this.url);
        this.tbiFile = new dallianceLib.URLFetchable(this.url + this.prop('indexExt'));
      } else if (this.dataFile && this.indexFile) {
        this.vcfFile = new dallianceLib.BlobFetchable(this.dataFile);
        this.tbiFile = new dallianceLib.BlobFetchable(this.indexFile);
      } else {
        return deferred.rejectWith(model, [ 'GZipped VCF files must be accompanied by a .tbi index file' ]);
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
    var lines   = text.split('\n');
    var feature=[];
    var maxQual = this.allData ? this.prop('maxQual') || 0 : false;
var feature1=[];
    for (var i = 0; i < lines.length; i++) {
      if (!lines[i].length || lines[i].indexOf('#') === 0) {
        continue;
      }

      var fields = lines[i].split('\t');

      if (fields.length < 5) {
        continue;
      }

      if (fields[0] == chr || fields[0] == 'chr' + chr) {
        var id      = fields.slice(0, 3).join('|');
        var start   = parseInt(fields[1], 10);
        var alleles = fields[4].split(',');
        if(fields[4]==fields[3]){
        var wt=fields[3];}
var MAF1=[];
MAF1=fields[4].length/(fields[4].length+fields[3].length)
        alleles.unshift(fields[3]);

        
         for (var j = 0; j < alleles.length; j++) {
          var end = start + alleles[j].length - 1;
var height=alleles[j].length-1;
if(MAF1>0.3&&MAF1<0.7){
          this.insertFeature({
            chr             : chr,
            start           : start,
            end             : end,
            height : height,
            MAF1:MAF1
            
          });}
      
         console.log(alleles[j].length);
                }
          
     if (maxQual !== false) {
          maxQual = Math.max(maxQual, fields[5]);
        }
      }
    }

    if (maxQual) {
      this.prop('maxQual', maxQual);
    }
  }
});

           

                

        
//      }
//      
//    }
//
////    return this.base.call(this, feature, chr, s, e);
////    return this.base.call(this, feature1, chr, s, e);
//  }
//});









