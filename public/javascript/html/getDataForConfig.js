var $ = jQuery;
var global_url = location.protocol + '//' + location.host;
var object = document.currentScript.getAttribute('data');
var data = JSON.parse(object);
var nameTracks = ["Ensembl Genes", "Ensembl Sequence", "dbSNPs", "Scalebar", "Chromosome", "FASTA", "BED", "BAM", "BIGWIG", "GFF", "VCF", "SNP Density", "Gene Expression", "Custom Track"];
var tracks = [
    gene = [], sequence = [], dbSNP = [],
    scalebar = [{name: "scalebar", description: "display the scalebar", data: "Genoverse.Track.Scalebar"}],
    chromosome = [{name: "chromosome", description: "display the chromosome", data: 'Genoverse.Track.Chromosome'}],
    fasta = [], bed = [], bam = [], bigwig = [], gff = [], vcf = [], SnpDensity = [], geneExpression = [], custom = []
];
var trackCount = 0;

function loadTracks() {
    var tracksLength = data.tracks.length;
    console.log(data.tracks);
    for (var i = 5; i < tracksLength; i++) {
        currentTrack = data.tracks[i];
        for (var j in currentTrack.trackChildren) {
            switch (currentTrack.group) {
                case 'FASTA':
                    addFastaTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'BED':
                    addBedTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'BAM':
                    addBamTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'BIGWIG':
                    addBigwigTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'GFF':
                    addGffTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'VCF':
                    addVcfTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'SNP Density':
                    addSnpDensityTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'Gene Expression':
                    addGeneExpressionTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'Custom Track':
                    addCustomTrack(true, currentTrack.trackChildren[j]);
                    break;
                default:
                    console.log('The group name of the track does not match');
            }
        }
    }
}

function setEnsembl() {
    $("#ensembl").show();
    $("#filechoose").hide();
    $("#upload").hide();
    $("#ensembl-only-tracks").show();
}

function setGenomeChoose() {
    $("#ensembl").hide();
    $("#filechoose").show();
    $("#upload").hide();
    $("#ensembl-only-tracks").hide();
    $("#gene_id").prop("checked", false);
    $("#seq_id").prop("checked", false);
    $("#snp_id").prop("checked", false);
    // finish this to work with genome choice
    // set up select with genomes in directory
}

function setGenomeUpload() {
    $("#ensembl").hide();
    $("#filechoose").hide();
    $("#upload").show();
    $("#ensembl-only-tracks").hide();
    $("#gene_id").prop("checked", false);
    $("#seq_id").prop("checked", false);
    $("#snp_id").prop("checked", false);
}
$("#select_all_id").change(function () {
    selectAll();
});

function selectAll() {
    var selecting = $("#select_all_id").is(":checked");
    var tracks = document.querySelectorAll("#ensembl-only-tracks input");
    console.log(tracks);
    //console.log(selecting);
    switch (selecting) {
        case true:
            for (var i = 1; i < tracks.length; i++) {
                tracks[i].checked = true;
            }
            break;
        case false:
            for (var i = 1; i < tracks.length; i++) {
                tracks[i].checked = false;
            }
            break;
    }
}

$("#select_all_Plugins_id").change(function () {
    selectAllPlugins();
});

function selectAllPlugins() {
      var selecting = $("#select_all_Plugins_id").is(":checked");
    var plugins = document.querySelectorAll("#plugins.list-group input");
    console.log(plugins);
    //console.log(selecting);
    switch (selecting) {
        case true:
            for (var i = 0; i < plugins.length; i++) {
                plugins[i].checked = true;
            }
            break;
        case false:
            for (var i = 0; i < plugins.length; i++) {
                plugins[i].checked = false;
            }
            break;
    }
}

$("#select_all_Tracks_id").change(function () {
    selectAllTracks();
});

function selectAllTracks() {
    var selecting = $("#select_all_Tracks_id").is(":checked");
    //console.log(selecting);
  var configtracks = document.querySelectorAll("#tracks.list-group input");
    console.log(configtracks);
    
    switch (selecting) {
        case true:
            for (var i = 0; i < configtracks.length; i++) {
                configtracks[i].checked = true;
            }
            break;
        case false:
            for (var i = 0; i < configtracks.length; i++) {
                configtracks[i].checked = false;
            }
            break;
    }
}

// UPLOAD GENOME FILE
$(function () {
    // Attach the `fileselect` event to genome file input
    $(document).on('change', ':file', function () {
        var filechoice = $(this);
        label = filechoice.val().replace(/\\/g, '/').replace(/.*\//, '');
        filechoice.trigger('fileselect', [label]);
    });
    // We can watch for our custom `fileselect` event like this
    $(document).ready(function () {
        $(':file').on('fileselect', function (event, label) {
            var filechoice = $(this).parents('#upload.input-group').find(':text'),
                    log = label;
            if (filechoice.length) {
                filechoice.val(log);
            }
        });
    });
});

function removeTrack(item) {
    console.log('track deleted');
    var id = '#L' + $(item).data('id');
    var name = $(id).text();
    console.log(name);
    $(id).remove();
    for (var i = 0; i < tracks.length; i++) {
        for (var j = 0; j < tracks[i].length; j++) {
            if (tracks[i][j].name === name) {
                console.log(tracks[i][j]);
                tracks[i].splice(j, 1);
            }
        }
    }
}


/////////////////////////////////////
//          ADD NEW TRACKS         //
/////////////////////////////////////

function addGeneTrack() {
    var species = findSpecies();
    var trackString = 'Genoverse.Track.Gene.extend({\nspecies: \''
            + species + '\',\n100000: {\nlabels: true,\n' +
            'model: Genoverse.Track.Model.Gene.Ensembl.extend' +
            '({url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=gene;content-type=application/json\'}),\n' +
            'view: Genoverse.Track.View.Gene.Ensembl\n},\n' +
            '1: {\nlabels: true,\n' +
            'model: Genoverse.Track.Model.Transcript.Ensembl.extend' +
            '({url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=transcript;feature=exon;feature=cds;content-type=application/json\'}),\n' +
            'view: Genoverse.Track.View.Transcript.Ensembl\n}\n})';
    var track = {name: 'Gene', description: "Genes extracted from Ensembl", data: trackString};
    gene.push(track);
    console.log('Gene track added');
}

function addSequenceTrack() {
    var species = findSpecies();
    var trackString = 'Genoverse.Track.extend({\n' +
            'name: \'sequence\',\n' +
            'info: \'sequence information from ensembl\',\n' +
            'controller: Genoverse.Track.Controller.Sequence,\n' +
            'model: Genoverse.Track.Model.Sequence.Ensembl.extend({url:' + '\'//rest.ensembl.org/sequence/region/' + species + '/__CHR__:__START__-__END__?content-type=text/plain\'}),\n' +
            'view: Genoverse.Track.View.Sequence,\n' +
            '100000: false,\n' +
            'resizable: \'auto\'\n' +
            '})';
    var track = {name: 'Sequence', description: "sequence information from ensembl", data: trackString};
    sequence.push(track);
    console.log('Sequence track added');
}

function addDbsnpTrack() {
    var species = findSpecies();
    var trackString = 'Genoverse.Track.dbSNP.extend({\n' +
            'species: \'' + species + '\',\n' +
            'url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=variation;content-type=application/json\'\n' +
            '})';
    var track = {name: 'dbSNP', description: "All sequence variants from the database of Single Nucleotide Polymorphisms (dbSNP)", data: trackString};
    dbSNP.push(track);
    console.log('dbSNP track added');
}

function addFastaTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.extend({\n' +
            'name: \'' + $('#fastaNameInput').val() + '\',\n' +
            'info: \'' + $('#fastaInfoInput').val() + '\',\n' +
            'controller: Genoverse.Track.Controller.Sequence,\n' +
            'model: Genoverse.Track.Model.Sequence.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=faidx\',\n' +
            'urlParams: {file: \'' + $('#fastaUrlInput').val() + '\'}\n' +
            '}),\n' +
            'view: Genoverse.Track.View.Sequence,\n' +
            '100000: false,\n' +
            'resizable: \'auto\'\n' +
            '})';
    var name = modify ? object.name : $("#fastaNameInput").val();
    var info = modify ? object.description : $('#fastaInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('fasta');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#fastaTracks').append(listItem);
        fasta.push(track);
        console.log('Fasta track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseFASTA').collapse('show');
    }
}

function addBedTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.BED.extend({\nname: \''
            + $('#bedNameInput').val() + '\',\ninfo: \''
            + $('#bedInfoInput').val() + '\',\nurl: \'' +
            'model: Genoverse.Track.Model.File.BED.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#bedUrlInput').val() + '\'}\n})';
    var name = modify ? object.name : $("#bedNameInput").val();
    var info = modify ? object.description : $('#bedInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('bed');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bedTracks').append(listItem);
        bed.push(track);
        console.log('BED track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseBED').collapse('show');
    }
}

function addBamTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.BAM.extend({\nname: \'' +
            $('#bamNameInput').val().replace(/\s/g, '</br>') + '\',\ninfo: \'' +
            $('#bamInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.File.ftpBAM.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=bam\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#bamUrlInput').val() + '\'}\n' +
            '})';
    // Add other variable parameters
    trackString = modify ? trackString : trackString + '\n})';
    var name = modify ? object.name : $("#bamNameInput").val();
    var info = modify ? object.description : $('#bamInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('bam');

    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bamTracks').append(listItem);
        bam.push(track);
        console.log('BAM track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseBAM').collapse('show');
    }
}

function addBigwigTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.BIGWIG.extend({\nname: \''
            + $('#bigwigNameInput').val() + '\',\ninfo: \''
            + $('#bigwigInfoInput').val() + '\',\nurl: \''
            + $('#bigwigUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $('#bigwigNameInput').val();
    var info = modify ? object.description : $('#bigwigInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('bigwig');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bigwigTracks').append(listItem);
        bigwig.push(track);
        console.log('BIGWIG track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseBIGWIG').collapse('show');
    }
}

function addGffTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.GFF.extend({\nname: \''
            + $('#gffNameInput').val() + '\',\ninfo: \''
            + $('#gffInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.File.GFF.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#gffUrlInput').val() + '\'}';

    if (!modify & $('#gffTypeMapText').val() !== '') {
        trackString = trackString + ',\ntypeMap: {\n' +
                $('#gffTypeMapText').val() + '\n}';
    }
    trackString = modify ? trackString : trackString + '\n})';
    // Add other variable parameters
    if (!modify & $('#gffThresholdInput').val() !== '') {
        trackString = trackString + ',\nthreshold: ' + $('#gffThresholdInput').val();
    }
    if (!modify & $('#gffIntronSelect').val() !== '') {
        trackString = trackString + ',\nview: Genoverse.Track.View.GFF.extend({' +
                'intronStyle: \'' + $('#gffIntronSelect').val() + '\'})';
    }
    trackString = modify ? trackString : trackString + '\n})';
    var name = modify ? object.name : $("#gffNameInput").val();
    var info = modify ? object.description : $('#gffInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('gff');

    if (valid === true) {
        console.log(trackString);
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#gffTracks').append(listItem);
        gff.push(track);
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseGFF').collapse('show');
    }
}

function addVcfTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.VCF.extend({\nname: \''
            + $('#vcfNameInput').val() + '\',\ninfo: \''
            + $('#vcfInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.File.VCF.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#vcfUrlInput').val() + '\'}\n' +
            '})';
    if (!modify & $('#vcfThresholdInput').val() !== '') {
        trackString += ',\nthreshold: ' + $('#vcfThresholdInput').val();
    }
    if (!modify & $('#vcfMaxqualInput').val() !== '') {
        trackString += ',\nmaxQual: ' + $('#vcfMaxqualInput').val();
    }
    if (!modify) {
        trackString += '\n})';
    }
    var name = modify ? object.name : $("#vcfNameInput").val();
    var info = modify ? object.description : $('#vcfInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('vcf');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#vcfTracks').append(listItem);
        vcf.push(track);
        console.log('VCF track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseVCF').collapse('show');
    }
}

function addWigTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.WIG.extend({\nname: \''
            + $('#wigNameInput').val() + '\',\ninfo: \''
            + $('#wigInfoInput').val() + '\',\nurl: \''
            + $('#wigUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $("#wigNameInput").val();
    var info = modify ? object.description : $('#wigInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('wig');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#wigTracks').append(listItem);
        wig.push(track);
        console.log('WIG track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseWIG').collapse('show');
    }
}

function addBigwigTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.ftpBIGWIG.extend({\nname: \''
            + $('#bigwigNameInput').val() + '\',\ninfo: \''
            + $('#bigwigInfoInput').val() + '\',\n' +
            "model: Genoverse.Track.Model.File.ftpBIGWIG.extend({" +
                        'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=bigwig\',\n' +
                        'urlParams: {file: \'' + $('#bigwigUrlInput').val() + '\'}' + '\n})' + '\n})';
    var name = modify ? object.name : $('#bigwigNameInput').val();
    var info = modify ? object.description : $('#bigwigInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkTrack('bigwig');
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bigwigTracks').append(listItem);
        bigwig.push(track);
        console.log('BIGWIG track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseBIGWIG').collapse('show');
    }
}

function addSnpDensityTrack(modify, object) {
    // Make heterozygous track
    var trackString = modify ? object.data : 'Genoverse.Track.SNPDensity.extend({\nname: \'' +
            $('#hetSnpDensityNameInput').val() + '\',\ninfo: \'' +
            $('#hetSnpDensityInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.HeteroSNPDensity.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#snpDensityUrlInput').val() + '\'}\n' +
            '})})';
    console.log(trackStringHet);
    var nameHet = modify ? object.name : $('#hetSnpDensityNameInput').val();
    var infoHet = modify ? object.description : $('#hetSnpDensityInfoInput').val();
    var trackHet = {name: nameHet, description: infoHet, type: 'snpDensity', data: trackStringHet};
    // Make homozygous track
    var trackStringHom = modify ? object.data : 'Genoverse.Track.HomoSNPDensity.extend({\nname: \'' +
            $('#homSnpDensityNameInput').val() + '\',\ninfo: \'' +
            $('#homSnpDensityInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.HomoSNPDensity.extend({\n' +
            'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'largeFile: true,\n' +
            'urlParams: {file: \'' + $('#snpDensityUrlInput').val() + '\'}\n' +
            '})})';
    console.log(trackStringHom);
    var nameHom = modify ? object.name : $('#homSnpDensityNameInput').val();
    var infoHom = modify ? object.description : $('#homSnpDensityInfoInput').val();
    var trackHom = {name: nameHom, description: infoHom, type: 'snpDensity', data: trackStringHom};
    // Add to list
    var valid = true;
    if (!modify)
        valid = checkSnpDensityTrack(nameHet, nameHom, infoHet, infoHom, $('#snpDensityUrlInput').val());
    if (valid === true) {
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + nameHet + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#snpDensityTracks').append(listItem);
        trackCount++;
        listItem = '<div id= "L' + trackCount + '" ></br><li>' + nameHom + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#snpDensityTracks').append(listItem);
        snpDensity.push(trackHet);
        snpDensity.push(trackHom);
        console.log('SNP track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseSNPDensity').collapse('show');
    }
}

function addGeneExpressionTrack(modify, object) {
    console.log('gene expression track added');
    var trackString = modify ? object.data : 'Genoverse.Track.GeneExpression.extend({\nname: \''
            + $('#geneExpressionNameInput').val() + '\',\ninfo: \''
            + $('#geneExpressionInfoInput').val() + '\',\nurl: \''
            + $('#geneExpressionRsemUrlInput').val() + '\',\nindexUrl: \''
            + $('#geneExpressionGffUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $('#geneExpressionNameInput').val();
    var info = modify ? object.description : $('#geneExpressionInfoInput').val();
    var valid = true;
    if (!modify)
        valid = checkGeneExpressionTrack(name, info, $('#geneExpressionRsemUrlInput').val(), $('#geneExpressionGffUrlInput').val());
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#geneExpressionTracks').append(listItem);
        geneExpression.push(track);
        console.log('Gene expression track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseGeneExpression').collapse('show');
    }
}

function addCustomTrack(modify, object) {
    var name = modify ? object.name : $("#customNameInput").val();
    var info = modify ? object.description : $("#customInfoInput").val();
    var trackString = modify ? object.data : $('#customText').val();
    var valid = true;
    if (!modify)
        valid = checkCustomTrack(name, info, trackString);

    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#customTracks').append(listItem);
        custom.push(track);
        console.log('Custom track added');
        trackCount++;
        $('.modal').modal('hide');
        $('#collapseCUSTOM').collapse('show');
    }
}

function findSpecies() {
    // Get the species from Ensembl
    var species = document.querySelector("#genomic-species-select");
    return species[species.selectedIndex].value;
}

function uploadGenome() {
    var file = $(':file')[0].files[0];
    return file;
}

function findListGenome() {
    // Get the genome from the list
    var genome = document.querySelector("#genomic-files-select");
    return genome[genome.selectedIndex].value;
}

/////////////////////////////////////
//           SUMBIT FORM           //
/////////////////////////////////////

// Check the form when click on the button submit
function validate(modify) {
    var ensemblVisible = $("#ensembl").is(':visible');
    var genomeListVisible = $("#filechoose").is(':visible');
    var genomeUploadVisible = $("#upload").is(':visible');

    var valide = true;

    // Get all the inputs of the chromosome
    var inputs = document.querySelectorAll("#inputs input");
    for (var i = 0; i < inputs.length; i++) {
        check[inputs[i].name](); // Check
        if (!check[inputs[i].name]()) {
            valide = false;
        }
    }

    // Get the genome from Ensembl or file or list
    if (ensemblVisible) {
        var genomeSelected = {name: findSpecies(), type: "ensembl"};
        if (!check["species"](genomeSelected))
            valide = false;
    } else if (genomeListVisible) {
        var genomeSelected = {name: findListGenome(), type: "list"};
        if (!check["listGenome"](genomeSelected))
            valide = false;
    } else if (genomeUploadVisible) {
        var file = uploadGenome();
        var genomeSelected = {name: file.name.slice(0, -3), type: "genome"};
        if (!check["uploadGenome"](genomeSelected, file.type.includes("javascript")))
            valide = false;
    } else {
        valide = false;
    }

    // Get all the plugins
    var pluginsElement = document.querySelectorAll("#plugins .material-switch input");
    var pluginsLength = pluginsElement.length;
    var plugins = [];

    // Go through all the plugins to know if they are checked and push in the array
    for (var i = 0; i < pluginsLength; i++) {
        if (pluginsElement[i].checked) {
            plugins.push({name: pluginsElement[i].name, checked: true, id: pluginsElement[i].id});
        } else {
            plugins.push({name: pluginsElement[i].name, checked: false, id: pluginsElement[i].id});
        }
    }

    // Get all the tracks selected
    var tracksElement = document.querySelectorAll("#ensembl-tracks .list-group-item input, #tracks .list-group-item input");
    var tracksLength = tracksElement.length;
    var tracksSelected = [];


    addDbsnpTrack();
    addGeneTrack();
    addSequenceTrack();

    for (var i = 0; i < tracksLength; i++) {
        if (tracksElement[i].checked) {
            tracksSelected.push({group: nameTracks[i], checked: true, trackChildren: tracks[i]});
        } else {
            tracksSelected.push({group: nameTracks[i], checked: false, trackChildren: tracks[i]});
        }
    }

    if (valide) {
        var data = {};
        data.plugins = plugins;
        data.genome = genomeSelected;
        data.name = inputs[0].value;
        data.description = inputs[1].value;
        data.chromosome = inputs[2].value;
        data.start = inputs[3].value;
        data.end = inputs[4].value;
        data.tracks = tracksSelected;

        if (modify) {
            var url = location.href;
            var url_dec = decodeURIComponent(url);
//            console.log(url);
            var previousName = url_dec.match(/name=([^&?]*)/)[1];
//            console.log(previousName);
            data.previous = previousName;

            if (genomeUploadVisible) {
                readFile(file, function (content) {
                    data.file = {filename: file.name, content: content};
                    console.log(data);
                    sendData(data, global_url + '/modify');
                });
            } else {
                console.log(data);
                sendData(data, global_url + '/modify');
            }
        } else {
            if (genomeUploadVisible) {
                readFile(file, function (content) {
                    data.file = {filename: file.name, content: content};
                    console.log(data);
                    sendData(data, global_url + '/instance');
                });
            } else {
                console.log(data);
                sendData(data, global_url + '/instance');
            }
        }
    } else {
        alert('Please fill in the form correctly');
    }

}

function readFile(file, cb) { // We pass a callback as parameter
    var content = "";
    var reader = new FileReader();

    reader.onload = function (e) {
        content = reader.result;
        // Content is ready, call the callback
        cb(content);
    };

    reader.readAsText(file);
}

function sendData(data, url) {
    console.log("Try to send the data");
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: url,
        success: function (data) {
            console.log('success');
            console.log(JSON.stringify(data));
            if (data === 'done')
            {
                window.location.href = "/";
            } else {
                alert('Error Creating the Instance');
            }
        },
        error: function () {
            console.log('process error');
        }
    });
}


/* Functions to check if the form is filled properly
 * If not change the background color
 */
var check = {};
check['info'] = function () {
    var info = document.getElementById("project-info-input");

    // Not empty
    if (info.value !== "") {
        info.style.background = "white";
        return true;
    } else {
        info.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['name'] = function () {
    var name = document.getElementById("project-name-input");

    // Not empty
    if (name.value !== "") {
        name.style.background = "white";
        return true;
    } else {
        name.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['chromosome'] = function () {
    var chrom = document.getElementById("chromosome-input");

    // Chromosome greater than 0 and not empty
    if (chrom.value !== "") {
        return true;
    } else {
        chrom.value = 1;
        return true;
    }
};

check['start'] = function () {
    var start = document.getElementById("genomic-start-input");

    // Start greater or equal to 0 and not empty
    if (start.value !== "") {
        return true;
    } else {
        start.value = 1;
        return true;
    }
};

check['end'] = function () {
    var end = document.getElementById("genomic-end-input");

    // End greater than the start value and not empty
    if (end.value !== "") {
        return true;
    } else {
        end.value = 10000;
        return true;
    }
};

check['species'] = function (value) {
    var species = document.getElementById("genomic-species-select");
    if (value) {
        species.style.background = "white";
        return true;
    } else {
        species.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['listGenome'] = function (value) {
    var genome = document.getElementById("genomic-files-select");
    if (value.name) {
        genome.style.background = "white";
        return true;
    } else {
        genome.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['uploadGenome'] = function (value, fileType) {
    var genome = document.getElementById("upload-input");
    if (value.name && fileType) {
        genome.style.background = "white";
        return true;
    } else {
        genome.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

/////////////////////////////////////
//   CHECK INPUTS OF TRACK FORMS   //
/////////////////////////////////////


function checkTrack(track) {
    var valid = true;
    if ($('#' + track + 'NameInput').val() === '') {
        valid = false;
        $('#' + track + 'NameInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#' + track + 'NameInput').css({'background-color': "white"});
    }
    if ($('#' + track + 'InfoInput').val() === '') {
        valid = false;
        $('#' + track + 'InfoInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#' + track + 'InfoInput').css({'background-color': "white"});
    }
    if ($('#' + track + 'UrlInput').val() === '') {
        valid = false;
        $('#' + track + 'UrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#' + track + 'UrlInput').css({'background-color': "white"});
    }
    if ($('#' + track + 'ThresholdInput')) {
        if (Number($('#' + track + 'ThresholdInput').val()) > 10000) {
            valid = false;
            $('#' + track + 'ThresholdInput').css({'background-color': "rgba(255,0,51,0.6)"});
        } else {
            $('#' + track + 'ThresholdInput').css({'background-color': "white"});
        }
    }
    if ($('#' + track + 'MaxqualInput')) {
        if (Number($('#' + track + 'MaxqualInput').val()) > 10000) {
            valid = false;
            $('#' + track + 'MaxqualInput').css({'background-color': "rgba(255,0,51,0.6)"});
        } else {
            $('#' + track + 'MaxqualInput').css({'background-color': "white"});
        }
    }
    return valid;
}


function checkSnpDensityTrack(nameHet, nameHom, infoHet, infoHom, url) {
    var valid = true;
    if (nameHet === '') {
        valid = false;
        $("#hetSnpDensityNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#hetSnpDensityNameInput").css({'background-color': "white"});
    }
    if (infoHet === '') {
        valid = false;
        $("#hetSnpDensityInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#hetSnpDensityInfoInput").css({'background-color': "white"});
    }
    if (nameHom === '') {
        valid = false;
        $("#homSnpDensityNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#homSnpDensityNameInput").css({'background-color': "white"});
    }
    if (infoHom === '') {
        valid = false;
        $("#homSnpDensityInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#homSnpDensityInfoInput").css({'background-color': "white"});
    }
    if (url === '') {
        valid = false;
        $('#snpDensityUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#snpDensityUrlInput").css({'background-color': "white"});
    }
    return valid;
}

function checkGeneExpressionTrack(name, info, rsemUrl, gffUrl) {
    var valid = true;
    if (name === '') {
        valid = false;
        $("#geneExpressionNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#geneExpressionNameInput").css({'background-color': "white"});
    }
    if (info === '') {
        valid = false;
        $("#geneExpressionInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#geneExpressionInfoInput").css({'background-color': "white"});
    }
    if (rsemUrl === '') {
        valid = false;
        $('#geneExpressionRsemUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#geneExpressionRsemUrlInput').css({'background-color': "white"});
    }
    if (gffUrl === '') {
        valid = false;
        $('#geneExpressionGffUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#geneExpressionGffUrlInput').css({'background-color': "white"});
    }
    return valid;
}

function checkCustomTrack(name, info, trackString) {
    var valid = true;
    if (name === '') {
        valid = false;
        $("#customNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customNameInput").css({'background-color': "white"});
    }
    if (info === '') {
        valid = false;
        $("#customInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customInfoInput").css({'background-color': "white"});
    }
    if (trackString === '') {
        valid = false;
        $('#customText').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customText").css({'background-color': "white"});
    }
    return valid;
}