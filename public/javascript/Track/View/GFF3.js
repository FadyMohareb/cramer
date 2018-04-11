Genoverse.Track.View.GFF3 = Genoverse.Track.View.extend({
    bump: true,
    labels: true,
    intronStyle: 'bezierCurve',
    lineWidth: 0.5,
    drawFeature: function (feature, featureContext, labelContext, scale) {
        var exons = (feature.exons || []).sort(function (a, b) {
            return a.start - b.start;
        });
        if (!exons.length || exons[0].start > feature.start) {
            exons.unshift({
                start: feature.start,
                end: feature.start
            });
        }

        if (!exons.length || exons[exons.length - 1].end < feature.end) {
            exons.push({
                start: feature.end,
                end: feature.end
            });
        }
        for (var i = 0; i < exons.length; i++) {
            var exon = exons[i];
            featureContext.strokeStyle = exon.color || feature.color || this.color;
            featureContext.lineWidth = 1;
            featureContext.strokeRect(
                    feature.x + (exon.start - feature.start) * scale,
                    feature.y + 1.5,
                    Math.max(1, (exon.end - exon.start) * scale),
                    feature.height - 3
                    );

            if (i)
                this.drawIntron({
                    x: feature.x + (exons[i - 1].end - feature.start) * scale,
                    y: feature.y + feature.height / 2 + 0.5,
                    width: (exon.start - exons[i - 1].end) * scale,
                    height: feature.strand > 0 ? -feature.height / 2 : feature.height / 2,
                }, featureContext);
        }
        if (feature.cds && feature.cds.length) {
            for (var i = 0; i < feature.cds.length; i++) {
                var cds = feature.cds[i];
                featureContext.fillStyle = cds.color || feature.color || this.color;
                featureContext.fillRect(
                        feature.x + (cds.start - feature.start) * scale,
                        feature.y,
                        Math.max(1, (cds.end - cds.start) * scale),
                        feature.height
                        );
            }
        }

        if (this.labels && feature.label) {
            this.drawLabel(feature, labelContext, scale);
        }
    },
    drawIntron: function (intron, context) {
        context.beginPath();
        context.lineWidth = this.lineWidth;
        switch (this.intronStyle) {
            case 'line' :
                context.moveTo(intron.x, intron.y);
                context.lineTo(intron.x + intron.width, intron.y);
                break;
            case 'hat' :
                context.moveTo(intron.x, intron.y);
                context.lineTo(intron.x + intron.width / 2, intron.y + intron.height);
                context.lineTo(intron.x + intron.width, intron.y);
                break;
            case 'bezierCurve' :
                context.moveTo(intron.x, intron.y);
                context.bezierCurveTo(intron.x, intron.y + intron.height, intron.x + intron.width, intron.y + intron.height, intron.x + intron.width, intron.y);
                break;
        }
        context.stroke();
        context.closePath();
    }


});