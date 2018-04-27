Genoverse.Track.SNPDensity = Genoverse.Track.Graph.Bar.extend({
  model  : Genoverse.Track.Model.SNPDensity,
  name   : 'snp density',
  height : 100,
  largeFile : true,
  resizable: false,
  rescalableY: false,
  threshold: 100000000,
  yrange: [0,0.5]
});
