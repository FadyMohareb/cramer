new Genoverse({
    container: '#genoverse', // Where to inject Genoverse (css/jQuery selector/DOM element)
    // If no genome supplied, it must have at least chromosomeSize, e.g.:
    // chromosomeSize : 249250621, // chromosome 1, human
    genome: 'grch38', // see javascript/genomes/
    chr: 12,
    start: 15555555,
    end: 15555556,
    plugins: ["controlPanel","karyotype","trackControls","resizer","focusRegion","fullscreen","tooltips","selectChromosome","search","fileDrop"],
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