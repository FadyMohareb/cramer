var object = document.currentScript.getAttribute('data');
var data = JSON.parse(object);
var plugins = [];
var plugin;

for (var i in data.plugins) {
    plugin = data.plugins[i];
    if (plugin.checked) {
        plugins.push(plugin.id);
    }
}

var trackConfig = [];
var tracksLength = data.tracks.length;
for (var i = 0; i < tracksLength; i++) {
    currentTrack = data.tracks[i];
    if (currentTrack.checked) {
        for (var j in currentTrack.trackChildren) {
            trackConfig.push(eval(currentTrack.trackChildren[j].data));
        }
    }
}

console.log(trackConfig);

new Genoverse({
    container: '#genoverse', // Where to inject Genoverse (css/jQuery selector/DOM element)
    // If no genome supplied, it must have at least chromosomeSize, e.g.:
    // chromosomeSize : 249250621, // chromosome 1, human
    genome: data.genome, // see javascript/genomes/
    chr: data.chr,
    start: data.start,
    end: data.end,
    plugins: plugins,
    tracks: 
            trackConfig
//            [   
//        Genoverse.Track.Scalebar,
//        Genoverse.Track.extend({
//            name: 'Sequence',
//            100000: false,
//            resizable: 'auto',
//            controller: Genoverse.Track.Controller.Sequence,
//            view: Genoverse.Track.View.Sequence,
//            model: Genoverse.Track.Model.Sequence.extend({
//                url: "http://localhost:4000/index/request?chr=__CHR__&start=__START__&end=__END__&type=faidx",
//                urlParams: {file: "ftp://138.250.31.77/Public/TomatoReference/SL2.50/Sol.2.50.fasta.gz"}
//            })
//        }),
//        Genoverse.Track.File.GFF.extend({
//            model: Genoverse.Track.Model.File.GFF.extend({
//                url: "http://localhost:4000/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix",
//                urlParams: {file: "ftp://138.250.31.77/Public/Genoverse/reference/SL3.0/ITAG3.10_gene_models.gff.gz"}
//            }),  
//            name: 'Gene<br/>Models',
//        })
//    ]
});