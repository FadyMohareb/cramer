var object = document.currentScript.getAttribute('data');
var data = JSON.parse(object);
console.log(data.genome);
var plugins = [];
var plugin;

for (var i in data.plugins) {
    plugin = data.plugins[i];
    if (plugin.checked) {
        plugins.push(plugin.id);
    }
}

new Genoverse({
    container: '#genoverse', // Where to inject Genoverse (css/jQuery selector/DOM element)
    // If no genome supplied, it must have at least chromosomeSize, e.g.:
    // chromosomeSize : 249250621, // chromosome 1, human
    genome: data.genome, // see javascript/genomes/
    chr: data.chr,
    start: data.start,
    end: data.end,
    plugins: plugins,
    tracks: [
        Genoverse.Track.Scalebar,
        Genoverse.Track.extend({
            name: 'Sequence',
            controller: Genoverse.Track.Controller.Sequence,
            model: Genoverse.Track.Model.Sequence.Ensembl,
            view: Genoverse.Track.View.Sequence,
            100000: false,
            resizable: 'auto'
        }),
        Genoverse.Track.Gene,
        Genoverse.Track.extend({
            name: 'Regulatory Features',
            url: 'http://rest.ensembl.org/overlap/region/human/__CHR__:__START__-__END__?feature=regulatory;content-type=application/json',
            resizable: 'auto',
            model: Genoverse.Track.Model.extend({dataRequestLimit: 5000000}),
            setFeatureColor: function (f) {
                f.color = '#AAA';
            }
        }),
        Genoverse.Track.dbSNP
    ]
});
