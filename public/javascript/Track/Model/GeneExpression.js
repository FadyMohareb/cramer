Genoverse.Track.Model.GeneExpression = Genoverse.Track.Model.Graph.Bar.extend({
    dataType: 'text',
    geneIds: [],
    expCounts: [],
    largeFile: true,
    expCountThreshold: 20,

    getData: function (chr, start, end, done) {

        if (this.urlRsem && this.url) {
            var deferred = $.Deferred();

            start = Math.max(1, start);
            end = Math.min(this.browser.getChromosomeSize(chr), end);

            if (typeof this.data !== 'undefined') {
                this.receiveDataRsem(typeof this.data.sort === 'function' ? this.data.sort(function (a, b) {
                    return a.start - b.start;
                }) : this.data, chr, start, end);
                return deferred.resolveWith(this);
            }

            var model = this;
            var bins = [];
            var length = end - start + 1;

            if (!this.urlRsem) {
                return deferred.resolveWith(this);
            }

                bins.push([start, end]);
            

            $.when.apply($, $.map(bins, function (bin) {
                var request = $.ajax({
                    url: model.parseURLRsem(chr, bin[0], bin[1]),
                    data: model.urlParamsRsem,
                    dataType: model.dataType,
                    context: model,
                    xhrFields: model.xhrFields,
                    success: function (data) {
                        this.receiveDataRsem(data, chr, bin[0], bin[1]);
                    },
                    error: function (xhr, statusText) {
                        this.track.controller.showError(statusText + ' while getting the data, see console for more details', arguments);
                    },
                    complete: function (xhr) {
                        this.dataLoading = $.grep(this.dataLoading, function (t) {
                            return xhr !== t;
                        });
                    }
                });

                request.coords = [chr, bin[0], bin[1]]; // store actual chr, start and end on the request, in case they are needed

                if (typeof done === 'function') {
                    request.done(done);
                }

                model.dataLoading.push(request);

                return request;
            })).done(function () {



                if (typeof this.data !== 'undefined') {
                    this.receiveData(typeof this.data.sort === 'function' ? this.data.sort(function (a, b) {
                        return a.start - b.start;
                    }) : this.data, chr, start, end);
                    return deferred.resolveWith(this);
                }

                var model = this;
                var bins = [];
                var length = end - start + 1;

                if (!this.url) {
                    return deferred.resolveWith(this);
                }

                if (this.dataRequestLimit && length > this.dataRequestLimit) {
                    var i = Math.ceil(length / this.dataRequestLimit);

                    while (i--) {
                        bins.push([start, i ? start += this.dataRequestLimit - 1 : end]);
                        start++;
                    }
                } else {
                    bins.push([start, end]);
                }

                $.when.apply($, $.map(bins, function (bin) {
                    var request = $.ajax({
                        url: model.parseURL(chr, bin[0], bin[1]),
                        data: model.urlParams,
                        dataType: model

                                .dataType,
                        context: model,
                        xhrFields: model.xhrFields,
                        success: function (data) {
                            this.receiveData(data, chr, bin[0], bin[1]);
                        },
                        error: function (xhr, statusText) {
                            this.track.controller.showError(statusText + ' while getting the data, see console for more details', arguments);
                        },
                        complete: function (xhr) {
                            this.dataLoading = $.grep(this.dataLoading, function (t) {
                                return xhr !== t;
                            });
                        }
                    });

                    request.coords = [chr, bin[0], bin[1]]; // store actual chr, start and end on the request, in case they are needed

                    if (typeof done === 'function') {
                        request.done(done);
                    }

                    model.dataLoading.push(request);

                    return request;
                })).done(function () {
                    deferred.resolveWith(model);
                });
            });
        }
        return deferred;

    },

    parseURLRsem: function (chr, start, end, url) {
        start = Math.max(1, start);
        end = Math.min(this.browser.getChromosomeSize(chr), end);
        return (url || this.urlRsem).replace(/__ASSEMBLY__/, this.browser.assembly).replace(/__CHR__/, chr).replace(/__START__/, start).replace(/__END__/, end);
    },

    receiveDataRsem: function (data, chr, start, end) {
        start = Math.max(1, start);
        end = Math.min(this.browser.getChromosomeSize(chr), end);
        this.setDataRange(chr, start, end);
        this.parseDataRsem(data, chr, start, end);
    },

    parseDataRsem: function (text, chr, s, e) {
        // parses the RSEM file
        var lines = text.split("\n");
        for (var i = 1; i < lines.length; i++) {

            var fields = lines[i].split("\t");
            if (fields[4] >= this.expCountThreshold) {
                this.geneIds.push(fields[0]);
                this.expCounts.push(fields[4]);
            }
        }
    },

    parseData: function (text, chr, s, e) {
        // parses the GFF
        var geneIds = this.geneIds;
        var expCounts = this.expCounts;
        var features = [];

        var lines = text.split("\n");


        for (var i = 0; i < lines.length; i++) {


            if (!lines[i].length || lines[i].indexOf('#') === 0)
                continue;

            var fields = lines[i].split("\t");

            if (fields.length < 5)
                continue;

            if (fields[0] === chr || fields[0].toLowerCase() === 'chr' + chr || fields[0].match('[^1-9]' + chr + '$')) {
                if (fields[2] === 'gene') {
                    for (var j = 0; j < geneIds.length; j++) {
                        if (geneIds[j] !== '' && fields[8].includes(geneIds[j])) {

                            features.push({
                                id: geneIds[j],
                                chr: chr,
                                start: parseInt(fields[3]),
                                end: parseInt(fields[4]),
                                height: parseFloat(expCounts[j])
                            });
                        }
                    }
                }
            }

        }
        return this.base.call(this, features, chr, s, e);
    }

});

