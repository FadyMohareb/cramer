/* global __dirname */

'use strict';

global.jQuery = global.$ = require(__dirname + '/public/javascript/lib/jquery.js');
require(__dirname + '/public/javascript/lib/jquery-ui.js');
require(__dirname + '/public/javascript/lib/jquery.mousewheel.js');
require(__dirname + '/public/javascript/lib/jquery.mousehold.js');
require(__dirname + '/public/javascript/lib/jquery.tipsy.js');

global.Base         = require(__dirname + '/public/javascript/lib/Base.js');
global.RTree        = require(__dirname + '/public/javascript/lib/rtree.js');
global.dallianceLib = require(__dirname + '/public/javascript/lib/dalliance-lib.min.js');
global.jDataView    = require(__dirname + '/public/javascript/lib/jDataView.js');
global.jParser      = require(__dirname + '/public/javascript/lib/jParser.js');
global.BWReader     = require(__dirname + '/public/javascript/lib/BWReader.js');
global.VCFReader    = require(__dirname + '/public/javascript/lib/VCFReader.js');

global.Genoverse = require(__dirname + '/public/javascript/Genoverse.js');

require(__dirname + '/public/javascript/Track.js');

require(__dirname + '/public/javascript/Track/Controller.js');
require(__dirname + '/public/javascript/Track/Model.js');
require(__dirname + '/public/javascript/Track/View.js');

require(__dirname + '/public/javascript/Track/library/Static.js');

require(__dirname + '/public/javascript/Track/Controller/Stranded.js');
require(__dirname + '/public/javascript/Track/Model/Stranded.js');

require(__dirname + '/public/javascript/Track/library/Graph.js');
require(__dirname + '/public/javascript/Track/library/Graph/Line.js');
require(__dirname + '/public/javascript/Track/library/Graph/Bar.js'); // Graph.Bar depends on Graph.Line

require(__dirname + '/public/javascript/Track/Controller/Sequence.js');
require(__dirname + '/public/javascript/Track/Model/Sequence.js');
require(__dirname + '/public/javascript/Track/Model/Sequence/Fasta.js');
require(__dirname + '/public/javascript/Track/Model/Sequence/Ensembl.js');
require(__dirname + '/public/javascript/Track/View/Sequence.js');
require(__dirname + '/public/javascript/Track/View/Sequence/Variation.js');

require(__dirname + '/public/javascript/Track/Model/SequenceVariation.js');

require(__dirname + '/public/javascript/Track/Model/Gene.js');
require(__dirname + '/public/javascript/Track/Model/Gene/Ensembl.js');
require(__dirname + '/public/javascript/Track/View/Gene.js');
require(__dirname + '/public/javascript/Track/View/Gene/Ensembl.js');

require(__dirname + '/public/javascript/Track/Model/Transcript.js');
require(__dirname + '/public/javascript/Track/Model/Transcript/Ensembl.js');
require(__dirname + '/public/javascript/Track/View/Transcript.js');
require(__dirname + '/public/javascript/Track/View/Transcript/Ensembl.js');
 
require(__dirname + '/public/javascript/Track/Model/File.js');
require(__dirname + '/public/javascript/Track/Model/File/BAM.js');
require(__dirname + '/public/javascript/Track/Model/File/ftpBAM.js');
require(__dirname + '/public/javascript/Track/Model/File/BED.js');
require(__dirname + '/public/javascript/Track/Model/File/GFF.js');
require(__dirname + '/public/javascript/Track/View/GFF.js');
require(__dirname + '/public/javascript/Track/Model/File/VCF.js');
require(__dirname + '/public/javascript/Track/Model/File/WIG.js');
require(__dirname + '/public/javascript/Track/Model/File/ftpBIGWIG.js');

require(__dirname + '/public/javascript/Track/Model/SNPDensity.js');
require(__dirname + '/public/javascript/Track/Model/GeneExpression.js');

require(__dirname + '/public/javascript/Track/library/Chromosome.js');
require(__dirname + '/public/javascript/Track/library/dbSNP.js');
require(__dirname + '/public/javascript/Track/library/File.js');
require(__dirname + '/public/javascript/Track/library/File/BAM.js');
require(__dirname + '/public/javascript/Track/library/File/BED.js');
require(__dirname + '/public/javascript/Track/library/File/BIGBED.js');
require(__dirname + '/public/javascript/Track/library/File/BIGWIG.js');
require(__dirname + '/public/javascript/Track/library/File/ftpBIGWIG.js');
require(__dirname + '/public/javascript/Track/library/File/GFF.js');
require(__dirname + '/public/javascript/Track/library/File/VCF.js');
require(__dirname + '/public/javascript/Track/library/File/WIG.js');
require(__dirname + '/public/javascript/Track/library/GeneExpression.js');
require(__dirname + '/public/javascript/Track/library/SNPDensity.js');
require(__dirname + '/public/javascript/Track/library/Gene.js');
require(__dirname + '/public/javascript/Track/library/HighlightRegion.js');
require(__dirname + '/public/javascript/Track/library/Legend.js');
require(__dirname + '/public/javascript/Track/library/Scaleline.js');
require(__dirname + '/public/javascript/Track/library/Scalebar.js');

require(__dirname + '/public/javascript/plugins/controlPanel.js');
require(__dirname + '/public/javascript/plugins/fileDrop.js');
require(__dirname + '/public/javascript/plugins/focusRegion.js');
require(__dirname + '/public/javascript/plugins/fullscreen.js');
require(__dirname + '/public/javascript/plugins/karyotype.js');
require(__dirname + '/public/javascript/plugins/resizer.js');
require(__dirname + '/public/javascript/plugins/tooltips.js');
require(__dirname + '/public/javascript/plugins/trackControls.js');
require(__dirname + '/public/javascript/plugins/search.js');
require(__dirname + '/public/javascript/plugins/selectChromosome.js');