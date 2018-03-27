Genoverse.Track.Gene = Genoverse.Track.extend({
  id     : 'genes',
  name   : 'Genes',
  height : 200,
  legend : true,
  species: 'homo_sapiens',

  populateMenu: function (feature) {
    var url  = 'http://www.ensembl.org/' + this.species + '/' + (feature.feature_type === 'transcript' ? 'Transcript' : 'Gene') + '/Summary?' + (feature.feature_type === 'transcript' ? 't' : 'g') + '=' + feature.id;
    var menu = {
      title    : '<a target="_blank" href="' + url + '">' + (feature.external_name ? feature.external_name + ' (' + feature.id + ')' : feature.id) + '</a>',
      Location : feature.chr + ':' + feature.start + '-' + feature.end,
      Source   : feature.source,
      Biotype  : feature.biotype
    };

    if (feature.feature_type === 'transcript') {
      menu.Gene = '<a target="_blank" href="http://www.ensembl.org/' + this.species + '/Gene/Summary?g=' + feature.Parent + '">' + feature.Parent + '</a>';
    }

    return menu;
  },

  // Different settings for different zoom level
  2000000: { // This one applies when > 2M base-pairs per screen
    labels : false
  },
  100000: { // more than 100K but less then 2M
    labels : true,
    model  : Genoverse.Track.Model.Gene.Ensembl.extend({ url: '//rest.ensembl.org/overlap/region/homo_sapiens/__CHR__:__START__-__END__?feature=gene;content-type=application/json' }),
    view   : Genoverse.Track.View.Gene.Ensembl
  },
  1: { // > 1 base-pair, but less then 100K
    labels : true,
    model  : Genoverse.Track.Model.Transcript.Ensembl.extend({ url: '//rest.ensembl.org/overlap/region/homo_sapiens/__CHR__:__START__-__END__?feature=transcript;feature=exon;feature=cds;content-type=application/json'}),
    view   : Genoverse.Track.View.Transcript.Ensembl
  }
});
