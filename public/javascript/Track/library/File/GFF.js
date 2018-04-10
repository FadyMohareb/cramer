Genoverse.Track.File.GFF = Genoverse.Track.File.extend({
  id            : 'gff',
  name          : 'GFF',
  model         : Genoverse.Track.Model.File.GFF,
  bump          : true,
  height        : 100,
  featureHeight : 5,
  threshold     : 100000
});

Genoverse.Track.File.GTF = Genoverse.Track.File.GFF;