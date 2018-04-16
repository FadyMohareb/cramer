Genoverse.Track.File.GFF = Genoverse.Track.File.extend({
    id: 'gff',
    name: 'GFF',
    model: Genoverse.Track.Model.File.GFF,
    autoHeight: false,
    height: 100,
    featureHeight: 10,
    threshold: 10000000,
    view: Genoverse.Track.View.GFF
});