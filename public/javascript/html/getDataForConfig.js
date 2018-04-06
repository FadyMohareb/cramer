var $ = jQuery;
var global_url = location.protocol + '//' + location.host;
var object = document.currentScript.getAttribute('data');
var data = JSON.parse(object);
var nameTracks = ["Ensembl Genes", "Ensembl Sequence", "dbSNPs", "Scalebar", "Chromosome", "FASTA", "BED", "BIGBED", "BAM", "GFF", "VCF", "WIG", "BIGWIG", "SNP Density", "Gene Expression", "Custom Track"];
var tracks = [
    gene = [], sequence = [], dbSNP = [],
    scalebar = [{name: "scalebar", description: "display the scalebar", data: "Genoverse.Track.Scalebar"}],
    chromosome = [{name: "chromosome", description: "display the chromosome", data: 'Genoverse.Track.Chromosome'}],
    fasta = [], bed = [], bigbed = [], bam = [], gff = [], vcf = [], wig = [], bigwig = [], snpDensity = [], geneExpression = [], custom = []
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
                case 'BIGBED':
                    addBigbedTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'BAM':
                    addBamTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'GFF':
                    addGffTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'VCF':
                    addVcfTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'WIG':
                    addWigTrack(true, currentTrack.trackChildren[j]);
                    break;
                case 'BIGWIG':
                    addBigwigTrack(true, currentTrack.trackChildren[j]);
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

function toggleSpecies() {
    $("#toggleButton").text(function (i, old) {
        return old === 'Ensembl' ? 'Upload File' : 'Ensembl';
    });
    $("#ensembl").toggle();
    $("#upload").toggle();
    if ($("#upload").is(':visible')) {
        $("#ensembl-only-tracks").hide();
        $("#gene_id").prop("checked", false);
        $("#seq_id").prop("checked", false);
        $("#snp_id").prop("checked", false);
    }
    if ($("#ensembl").is(':visible')) {
        $("#ensembl-only-tracks").show();
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


function uploadGenome() {
    var file = $(':file')[0].files[0];
    return file;
}


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
    console.log('gene track added');
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
    console.log(trackString);
}

function addSequenceTrack() {
    var species = findSpecies();
    console.log('sequence track added');
    var trackString = 'Genoverse.Track.extend({\n' +
            'name: \'sequence\',\n' +
            'info: \'sequence information from ensembl\',\n' +
            'controller: Genoverse.Track.Controller.Sequence,\n' +
            'model: Genoverse.Track.Model.Sequence.Ensembl.extend({url:' + '\'//rest.ensembl.org/sequence/region/' + species + '/__CHR__:__START__-__END__?content-type=text/plain\'}),\n' +
            'view: Genoverse.Track.View.Sequence,\n' +
            '100000: false,\n' +
            'resizable: \'auto\'\n' +
            '})';
    var track = {name: 'sequence', description: "sequence information from ensembl", data: trackString};
    sequence.push(track);
    console.log(trackString);
}

function addDbsnpTrack() {
    var species = findSpecies();
    console.log('dbSNP track added');
    var trackString = 'Genoverse.Track.dbSNP.extend({\n' +
            'species: \'' + species + '\',\n' +
            'url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=variation;content-type=application/json\'\n' +
            '})';
    var track = {name: 'dbSNP', description: "All sequence variants from the database of Single Nucleotide Polymorphisms (dbSNP)", data: trackString};
    dbSNP.push(track);
    console.log(trackString);
}

function addCustomTrack(modify, track) {
    console.log('custom track added');
    var name = $("#customNameInput").val();
    var info = $("#customInfoInput").val();
    var trackString = $('#customText').val();
    var valid = checkCustomTrack(name, info, trackString);
    if (modify)
        valid = true;
    if (valid == true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#customTracks').append(listItem);
        custom.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseCUSTOM').collapse('show');
    }
}

function addFastaTrack(modify, object) {
    console.log('fasta track added');
    var trackString = 'Genoverse.Track.extend({\n' +
            'name: \'' + $('#fastaNameInput').val() + '\',\n' +
            'info: \'' + $('#fastaInfoInput').val() + '\',\n' +
            'controller: Genoverse.Track.Controller.Sequence,\n' +
            'model: Genoverse.Track.Model.Sequence.extend({\n' +
            'url: \'http://localhost:4000/index/request?chr=__CHR__&start=__START__&end=__END__&type=faidx\',\n' +
            'urlParams: {file: \'' + $('#fastaUrlInput').val() + '\'}\n' +
            '}),\n' +
            'view: Genoverse.Track.View.Sequence,\n' +
            '100000: false,\n' +
            'resizable: \'auto\'\n' +
            '})';
    var name = modify ? object.name : $("#fastaNameInput").val();
    var info = modify ? object.description : $('#fastaInfoInput').val();
    var valid = checkTrack('fasta');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#fastaTracks').append(listItem);
        fasta.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseFASTA').collapse('show');
    }
}

function addBedTrack(modify, object) {
    console.log('bed track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.BED.extend({\nname: \''
            + $('#bedNameInput').val() + '\',\ninfo: \''
            + $('#bedInfoInput').val() + '\',\nurl: \''
            + $('#bedUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $("#bedNameInput").val();
    var info = modify ? object.description : $('#bedInfoInput').val();
    var valid = checkTrack('bed');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bedTracks').append(listItem);
        bed.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseBED').collapse('show');
    }
}

function addBigbedTrack(modify, object) {
    console.log('bigbed track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.BIGBED.extend({\nname: \''
            + $('#bigbedNameInput').val() + '\',\ninfo: \''
            + $('#bigbedInfoInput').val() + '\',\nurl: \''
            + $('#bigbedUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $("#bigbedNameInput").val();
    var info = modify ? object.description : $('#bigbedInfoInput').val();
    var valid = checkTrack('bigbed');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bigbedTracks').append(listItem);
        bigbed.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseBIGBED').collapse('show');
    }
}

function addBamTrack(modify, object) {
    var trackString = modify ? object.data : 'Genoverse.Track.File.BAM.extend({\nname: \''
            + $('#bamNameInput').val().replace(/\s/g, '</br>') + '\',\ninfo: \''
            + $('#bamInfoInput').val() + '\',\nurl: \''
            + $('#bamUrlInput').val() + '\'';
    // Add other variable parameters
    trackString = trackString + '\n})';
    var name = modify ? object.name : $("#bamNameInput").val();
    var info = modify ? object.description : $('#bamInfoInput').val();
    var valid = checkTrack('bam');
    if (modify)
        valid = true;
    if (valid == true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bamTracks').append(listItem);
        bam.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseBAM').collapse('show');
    }
}

function addGffTrack(modify, object) {
    console.log('gff track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.GFF.extend({\nname: \''
            + $('#gffNameInput').val() + '\',\ninfo: \''
            + $('#gffInfoInput').val() + '\',\n' +
            'model: Genoverse.Track.Model.File.GFF.extend({\n' +
            'url: \'http://localhost:4000/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
            'urlParams: {file: \'' + $('#gffUrlInput').val() + '\'}\n' +
            '})';
    // Add other variable parameters
    if (!modify & $('#gffThresholdInput').val() != '') {
        trackString = trackString + ',\nthreshold: ' + $('#gffThresholdInput').val();
    }
    trackString = trackString + '\n})';
    var name = modify ? object.name : $("#gffNameInput").val();
    var info = modify ? object.description : $('#gffInfoInput').val();
    var valid = checkTrack('gff');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#gffTracks').append(listItem);
        gff.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseGFF').collapse('show');
    }
}

function addVcfTrack(modify, object) {
    console.log('vcf track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.VCF.extend({\nname: \''
            + $('#vcfNameInput').val() + '\',\ninfo: \''
            + $('#vcfInfoInput').val() + '\',\nurl: \''
            + $('#vcfUrlInput').val() + '\'';
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
    var valid = checkTrack('vcf');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#vcfTracks').append(listItem);
        vcf.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseVCF').collapse('show');
    }
}

function addWigTrack(modify, object) {
    console.log('wig track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.WIG.extend({\nname: \''
            + $('#wigNameInput').val() + '\',\ninfo: \''
            + $('#wigInfoInput').val() + '\',\nurl: \''
            + $('#wigUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $("#wigNameInput").val();
    var info = modify ? object.description : $('#wigInfoInput').val();
    var valid = checkTrack('wig');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#wigTracks').append(listItem);
        wig.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseWIG').collapse('show');
    }
}

function addBigwigTrack(modify, object) {
    console.log('bigwig track added');
    var trackString = modify ? object.data : 'Genoverse.Track.File.BIGWIG.extend({\nname: \''
            + $('#bigwigNameInput').val() + '\',\ninfo: \''
            + $('#bigwigInfoInput').val() + '\',\nurl: \''
            + $('#bigwigUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $('#bigwigNameInput').val();
    var info = modify ? object.description : $('#bigwigInfoInput').val();
    var valid = checkTrack('bigwig');
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#bigwigTracks').append(listItem);
        bigwig.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseBIGWIG').collapse('show');
    }
}

function addSnpDensityTrack(modify, object) {
    console.log('snp density tracks added');
    // Make heterozygous track
    var trackStringHet = modify ? object.data : 'Genoverse.Track.HeteroSNPDensity.extend({\nname: \''
            + $('#hetSnpDensityNameInput').val() + '\',\ninfo: \''
            + $('#hetSnpDensityInfoInput').val() + '\',\nurl: \''
            + $('#snpDensityUrlInput').val() + '\'\n})';
    var nameHet = modify ? object.name : $('#hetSnpDensityNameInput').val();
    var infoHet = modify ? object.description : $('#hetSnpDensityInfoInput').val();
    var trackHet = {name: nameHet, description: infoHet, type: 'snpDensity', data: trackStringHet};
    // Make homozygous track
    var trackStringHom = modify ? object.data : 'Genoverse.Track.HomoSNPDensity.extend({\nname: \''
            + $('#homSnpDensityNameInput').val() + '\',\ninfo: \''
            + $('#homSnpDensityInfoInput').val() + '\',\nurl: \''
            + $('#snpDensityUrlInput').val() + '\'\n})';
    var nameHom = modify ? object.name : $('#homSnpDensityNameInput').val();
    var infoHom = modify ? object.description : $('#homSnpDensityInfoInput').val();
    var trackHom = {name: nameHom, description: infoHom, type: 'snpDensity', data: trackStringHom};
    // Add to list
    var valid = checkSnpDensityTrack(nameHet, nameHom, infoHet, infoHom, $('#snpDensityUrlInput').val());
    if (modify)
        valid = true;
    if (valid === true) {
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + nameHet + '/' + nameHom + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#snpDensityTracks').append(listItem);
        snpDensity.push(trackHet);
        snpDensity.push(trackHom);
        trackCount++;
        console.log(trackStringHom);
        console.log(trackStringHet);
        $('.modal').modal('hide');
        $('#collapseSNPDensity').collapse('show');
    }
}

function addGeneExpressionTrack(modify, object) {
    console.log('gene expression track added');
    var trackString = modify ? object.data : 'Genoverse.Track.GeneExpression.extend({\nname: \''
            + $('#geneExpressionNameInput').val() + '\',\ninfo: \''
            + $('#geneExpressionInfoInput').val() + '\',\nrsemUrl: \''
            + $('#geneExpressionRsemUrlInput').val() + '\',\ngffUrl: \''
            + $('#geneExpressionGffUrlInput').val() + '\'\n})';
    var name = modify ? object.name : $('#geneExpressionNameInput').val();
    var info = modify ? object.description : $('#geneExpressionInfoInput').val();
    var valid = checkGeneExpressionTrack(name, info, $('#geneExpressionRsemUrlInput').val(), $('#geneExpressionGffUrlInput').val());
    if (modify)
        valid = true;
    if (valid === true) {
        var track = {name: name, description: info, data: trackString};
        //Add to track list
        var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
        $('#geneExpressionTracks').append(listItem);
        geneExpression.push(track);
        trackCount++;
        console.log(trackString);
        $('.modal').modal('hide');
        $('#collapseGeneExpression').collapse('show');
    }
}

function findSpecies() {
    // Get the species from Ensembl
    var species = document.querySelector("#genomic-species-select");
    return species[species.selectedIndex].value;
}


/////////////////////////////////////
//           SUMBIT FORM           //
/////////////////////////////////////

// Check the form when click on the button submit
function validate(modify) {

    var valide = true;

    // Upload genome file if there is one chosen
    uploadGenome();

    // Get all the inputs of the chromosome
    var inputs = document.querySelectorAll("#inputs input");
    for (var i = 0; i < inputs.length; i++) {
        check[inputs[i].name](); // Check
        if (!check[inputs[i].name]()) {
            valide = false;
        }
    }

    // Get the genome from Ensembl or file
    var genomeSelected = $("#ensembl").is(':visible') ? findSpecies() : uploadGenome();
    if (!check["genome"](genomeSelected))
        valide = false;

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
        if (modify) {
            var url = new URL(window.location.href);
            var previousName = url.searchParams.get("name");
            console.log(previousName);

            var data = {};
            data.previous = previousName;
            data.plugins = plugins;
            data.genome = genomeSelected;
            data.name = inputs[0].value;
            data.description = inputs[1].value;
            data.chromosome = inputs[2].value;
            data.start = inputs[3].value;
            data.end = inputs[4].value;
            data.tracks = tracksSelected;
            console.log(data);
            sendData(data, global_url + '/modify');

        } else {
            var data = {};
            data.plugins = plugins;
            data.genome = genomeSelected;
            data.name = inputs[0].value;
            data.description = inputs[1].value;
            data.chromosome = inputs[2].value;
            data.start = inputs[3].value;
            data.end = inputs[4].value;
            data.tracks = tracksSelected;
            console.log(data);
            sendData(data, global_url + '/instance');

        }
    } else {
        alert('Please fill in the form correctly');
    }

}

function sendData(data, url) {
    console.log("Try to send");

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
    if (parseInt(chrom.value) > 0 && chrom.value !== "") {
        chrom.style.background = "white";
        return true;
    } else {
        chrom.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['start'] = function () {
    var start = document.getElementById("genomic-start-input");

    // Start greater or equal to 0 and not empty
    if (parseInt(start.value) >= 1 && start.value !== "") {
        start.style.background = "white";
        return true;
    } else {
        start.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['end'] = function () {
    var start = document.getElementById("genomic-start-input");
    var end = document.getElementById("genomic-end-input");

    // End greater than the start value and not empty
    if (parseInt(end.value) > parseInt(start.value) && end.value !== "") {
        end.style.background = "white";
        return true;
    } else {
        end.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['genome'] = function (value) {
    var genome = $("#ensembl").is(':visible') ? document.getElementById("genomic-species-select") : document.getElementById("upload-input");
    if (value) {
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
    if ($('#' + track + 'NameInput').val() == '') {
        valid = false;
        $('#' + track + 'NameInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#' + track + 'NameInput').css({'background-color': "white"});
    }
    if ($('#' + track + 'InfoInput').val() == '') {
        valid = false;
        $('#' + track + 'InfoInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#' + track + 'InfoInput').css({'background-color': "white"});
    }
    if ($('#' + track + 'UrlInput').val() == '') {
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
    if (nameHet == '') {
        valid = false;
        $("#hetSnpDensityNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#hetSnpDensityNameInput").css({'background-color': "white"});
    }
    if (infoHet == '') {
        valid = false;
        $("#hetSnpDensityInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#hetSnpDensityInfoInput").css({'background-color': "white"});
    }
    if (nameHom == '') {
        valid = false;
        $("#homSnpDensityNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#homSnpDensityNameInput").css({'background-color': "white"});
    }
    if (infoHom == '') {
        valid = false;
        $("#homSnpDensityInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#homSnpDensityInfoInput").css({'background-color': "white"});
    }
    if (url == '') {
        valid = false;
        $('#snpDensityUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#snpDensityUrlInput").css({'background-color': "white"});
    }
    return valid;
}

function checkGeneExpressionTrack(name, info, rsemUrl, gffUrl) {
    var valid = true;
    if (name == '') {
        valid = false;
        $("#geneExpressionNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#geneExpressionNameInput").css({'background-color': "white"});
    }
    if (info == '') {
        valid = false;
        $("#geneExpressionInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#geneExpressionInfoInput").css({'background-color': "white"});
    }
    if (rsemUrl == '') {
        valid = false;
        $('#geneExpressionRsemUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#geneExpressionRsemUrlInput').css({'background-color': "white"});
    }
    if (gffUrl == '') {
        valid = false;
        $('#geneExpressionGffUrlInput').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $('#geneExpressionGffUrlInput').css({'background-color': "white"});
    }
    return valid;
}

function checkCustomTrack(name, info, trackString) {
    var valid = true;
    if (name == '') {
        valid = false;
        $("#customNameInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customNameInput").css({'background-color': "white"});
    }
    if (info == '') {
        valid = false;
        $("#customInfoInput").css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customInfoInput").css({'background-color': "white"});
    }
    if (trackString == '') {
        valid = false;
        $('#customText').css({'background-color': "rgba(255,0,51,0.6)"});
    } else {
        $("#customText").css({'background-color': "white"});
    }
    return valid;
}