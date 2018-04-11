Genoverse.Track.File.GFF3 = Genoverse.Track.File.extend({
    id: 'gff3',
    name: 'GFF3',
    model: Genoverse.Track.Model.File.GFF3,
    autoHeight: false,
    height: 100,
    featureHeight: 10,
    threshold: 10000000,
    view: Genoverse.Track.View.GFF3
});