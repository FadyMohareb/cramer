// Variables
const $ = jQuery;
const global_url = location.protocol + '//' + location.host;
const object = document.currentScript.getAttribute('data');
const data = JSON.parse(object);
const nameTracks = ["Ensembl Genes", "Ensembl Sequence", "dbSNPs", "Scalebar", "Chromosome", "FASTA", "BED", "BAM", "BIGWIG", "GFF", "VCF", "SNP Density", "Gene Expression", "Custom Track"];
const tracks = [
    gene = [], sequence = [], dbSNP = [],
    scalebar = [{ name: "scalebar", description: "display the scalebar", data: "Genoverse.Track.Scalebar" }],
    chromosome = [{ name: "chromosome", description: "display the chromosome", data: 'Genoverse.Track.Chromosome' }],
    fasta = [], bed = [], bam = [], bigwig = [], gff = [], vcf = [], snpDensity = [], geneExpression = [], custom = []
];
let trackCount = 0;

// Load the track when modify page is opened at the onLoad()
function loadTracks() {
    console.log(data.tracks);
    for (let i = 5; i < data.tracks.length; i++) {
        currentTrack = data.tracks[i];
        for (let j in currentTrack.trackChildren) {
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

// Show or Hide
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

// Select/unselect all ensembl tracks
function selectAll() {
    const selecting = $("#select_all_id").is(":checked");
    const tracks = document.querySelectorAll("#ensembl-only-tracks input");

    if (selecting) {
        for (let i = 1; i < tracks.length; i++) {
            tracks[i].checked = true;
        }
    } else {
        for (let i = 1; i < tracks.length; i++) {
            tracks[i].checked = false;
        }
    }
}

$("#select_all_Plugins_id").change(function () {
    selectAllPlugins();
});

// Unselect/select all plugins
function selectAllPlugins() {
    const selecting = $("#select_all_Plugins_id").is(":checked");
    const plugins = document.querySelectorAll("#plugins.list-group input");

    if (selecting) {
        for (let i = 0; i < plugins.length; i++) {
            plugins[i].checked = true;
        }
    } else {
        for (let i = 0; i < plugins.length; i++) {
            plugins[i].checked = false;
        }
    }
}

$("#select_all_Tracks_id").change(function () {
    selectAllTracks();
});

// Unselect/Select all the tracks
function selectAllTracks() {
    const selecting = $("#select_all_Tracks_id").is(":checked");
    const configtracks = document.querySelectorAll("#tracks.list-group input");

    if (selecting) {
        for (let i = 0; i < configtracks.length; i++) {
            configtracks[i].checked = true;
        }
    } else {
        for (let i = 0; i < configtracks.length; i++) {
            configtracks[i].checked = false;
        }
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

// Function to clean inputs and display the popup modal
function openModal(modalId) {
    // Clean the inputs modal popup
    $(`${modalId} :input`).val('');
    $(`${modalId} :input`).css({ 'background-color': "white" });
    // Remove the trackId from the attribute
    $(modalId).removeAttr('trackId');

    // Add default text area to the custom modal popup
    if (modalId === '#customModal') {
        $('#customModal textarea').val('Genoverse.Track.extend ({\nid: \nname: \nmodel: \ninfo: \nurl: \nlabels: false\n}),');
    }
    // Display the popup modal
    $(modalId).modal('show');
}

// Remove tracks
function removeTrack(item) {
    const id = '#L' + $(item).data('id');
    const name = $(id).text();

    $(id).remove();
    for (let i = 0; i < tracks.length; i++) {
        for (let j = 0; j < tracks[i].length; j++) {
            if (tracks[i][j].name === name) {
                tracks[i].splice(j, 1);
                console.log(`track ${name} deleted`);
            }
        }
    }
}

// Modify tracks
function modifyTrack(item, trackType) {
    // Get the id name from the DOM
    const id = '#L' + $(item).data('id');
    const name = $(id).text();
    const modalId = `#${trackType}Modal`;

    console.log(`Modifying ${name} ${trackType} track ...`);

    openModal(modalId);

    // Add the trackId to the attribute of the modal to retrieve it when saving the modified track
    $(modalId).attr('trackId', id);

    // Find the track in the object
    for (let i = 0; i < tracks.length; i++) {
        for (let j = 0; j < tracks[i].length; j++) {
            if (tracks[i][j].name === name) {
                const track = tracks[i][j];

                // Add name and description to the input
                $(`${modalId} #${trackType}NameInput`).val(track.name);
                $(`${modalId} #${trackType}InfoInput`).val(track.description);

                // Add file url
                if (trackType === 'geneExpression') {
                    const urlParamsFile = track.data.match(/urlParams: {file:(.*)}/m);
                    $(`${modalId} #geneExpressionGffUrlInput`).val(urlParamsFile[1].replace(/("| |')/g, ''));
                    const urlParamsRsemFile = track.data.match(/urlParamsRsem: {file:(.*)}/m);
                    $(`${modalId} #geneExpressionRsemUrlInput`).val(urlParamsRsemFile[1].replace(/("| |')/g, ''));
                } else if (trackType !== 'custom') {
                    const urlParamsFile = track.data.match(/{file:(.*)}/m);
                    $(`${modalId} #${trackType}UrlInput`).val(urlParamsFile[1].replace(/("| |')/g, ''));
                }

                // Add specific value to the input according to the track type
                switch (trackType) {
                    case 'gff':
                        matchAndUpdateModal(track.data, new RegExp('typeMap: {\n((.|\\s)*)}\n', 'm'), modalId, '#gffTypeMapText');
                        matchAndUpdateModal(track.data, new RegExp('threshold:(.*)\n', 'm'), modalId, '#gffThresholdInput', new RegExp('("| |\'|,)', 'g'));
                        matchAndUpdateModal(track.data, new RegExp('intronStyle: (.*)}', 'm'), modalId, '#gffIntronSelect');
                        break;
                    case 'vcf':
                        matchAndUpdateModal(track.data, new RegExp('threshold:(.*)\n', 'm'), modalId, '#vcfThresholdInput', new RegExp('("| |\'|,)', 'g'));
                        matchAndUpdateModal(track.data, new RegExp('maxQual:(.*)\n', 'm'), modalId, '#vcfMaxqualInput', new RegExp('("| |\'|,)', 'g'));
                        break;
                    case 'snpDensity':
                        matchAndUpdateModal(track.data, new RegExp('binSize:(.*),\n', 'm'), modalId, '#snpDensityBinsizeInput');
                        matchAndUpdateModal(track.data, new RegExp('threshold:(.*)\n', 'm'), modalId, '#snpDensityThresholdInput');
                        break;
                    case 'geneExpression':
                        matchAndUpdateModal(track.data, new RegExp('expCountThreshold:(.*)\n', 'm'), modalId, '#geneExpressionExpcountInput');
                        matchAndUpdateModal(track.data, new RegExp('threshold:(.*)\n', 'm'), modalId, '#geneExpressionThresholdInput');
                        break;
                    case 'custom':
                        $(`${modalId} #customText`).val(track.data);
                        break;
                }
            }
        }
    }
}

/**
 * Function to find the value in the object with regex and display in the modal popup
 * @param {*} str String where to find the value
 * @param {*} regex Regex pattern to match
 * @param {*} modalId ModalId which will be displayed
 * @param {*} inputId InputId in the modal popup where to add the value found in the regex match
 * @param {*} replaceRegex Optional Regex pattern to replace the match (default is use to remove double quotes, single quote and white space")
 */
function matchAndUpdateModal(str, regex, modalId, inputId, replaceRegex = new RegExp(`("| |')`, 'g')) {
    const match = str.match(regex);
    if (match !== null && match[1] !== '') {
        $(`${modalId} ${inputId}`).val(match[1].replace(replaceRegex, ''));
    }
}

/////////////////////////////////////
//          ADD NEW TRACKS         //
/////////////////////////////////////

function addGeneTrack() {
    const species = findSpecies();
    const trackString = 'Genoverse.Track.Gene.extend({\nspecies: \''
        + species + '\',\n100000: {\nlabels: true,\n' +
        'model: Genoverse.Track.Model.Gene.Ensembl.extend' +
        '({url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=gene;content-type=application/json\'}),\n' +
        'view: Genoverse.Track.View.Gene.Ensembl\n},\n' +
        '1: {\nlabels: true,\n' +
        'model: Genoverse.Track.Model.Transcript.Ensembl.extend' +
        '({url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=transcript;feature=exon;feature=cds;content-type=application/json\'}),\n' +
        'view: Genoverse.Track.View.Transcript.Ensembl\n}\n})';
    const track = { name: 'Gene', description: "Genes extracted from Ensembl", data: trackString };
    gene.push(track);
    console.log('Gene track added');
}

function addSequenceTrack() {
    const species = findSpecies();
    const trackString = 'Genoverse.Track.extend({\n' +
        'name: \'sequence\',\n' +
        'info: \'sequence information from ensembl\',\n' +
        'controller: Genoverse.Track.Controller.Sequence,\n' +
        'model: Genoverse.Track.Model.Sequence.Ensembl.extend({url:' + '\'//rest.ensembl.org/sequence/region/' + species + '/__CHR__:__START__-__END__?content-type=text/plain\'}),\n' +
        'view: Genoverse.Track.View.Sequence,\n' +
        '100000: false,\n' +
        'resizable: \'auto\'\n' +
        '})';
    const track = { name: 'Sequence', description: "sequence information from ensembl", data: trackString };
    sequence.push(track);
    console.log('Sequence track added');
}

function addDbsnpTrack() {
    const species = findSpecies();
    const trackString = 'Genoverse.Track.dbSNP.extend({\n' +
        'species: \'' + species + '\',\n' +
        'url: \'//rest.ensembl.org/overlap/region/' + species + '/__CHR__:__START__-__END__?feature=variation;content-type=application/json\'\n' +
        '})';
    const track = { name: 'dbSNP', description: "All sequence variants from the database of Single Nucleotide Polymorphisms (dbSNP)", data: trackString };
    dbSNP.push(track);
    console.log('dbSNP track added');
}

function addFastaTrack(modify, object) {
    const modalId = '#fastaModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.extend({\n' +
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
    const name = modify ? object.name : $("#fastaNameInput").val();
    const info = modify ? object.description : $('#fastaInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('fasta', ['fasta', 'fa', 'fna', 'ffn', 'faa', 'frn']);
    }
    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track)
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'fasta', '#fastaTracks');
            fasta.push(track);
            console.log('Fasta track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseFASTA').collapse('show');
    }
}

function addBedTrack(modify, object) {
    const modalId = '#bedModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.File.BED.extend({\n' +
        'name: \'' + $('#bedNameInput').val() + '\',\n' +
        'info: \'' + $('#bedInfoInput').val() + '\',\n' +
        'model: Genoverse.Track.Model.File.BED.extend({\n' +
        'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
        'largeFile: true,\n' +
        'urlParams: {file: \'' + $('#bedUrlInput').val() + '\'}\n' +
        '})\n' +
        '})';
    const name = modify ? object.name : $("#bedNameInput").val();
    const info = modify ? object.description : $('#bedInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('bed', ['bed']);
    }
    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'bed', '#bedTracks');
            bed.push(track);
            console.log('BED track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseBED').collapse('show');
    }
}

function addBamTrack(modify, object) {
    const modalId = '#bamModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.File.BAM.extend({\n' +
        'name: \'' + $('#bamNameInput').val().replace(/\s/g, '</br>') + '\',\n' +
        'info: \'' + $('#bamInfoInput').val() + '\',\n' +
        'model: Genoverse.Track.Model.File.ftpBAM.extend({\n' +
        'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=bam\',\n' +
        'largeFile: true,\n' +
        'urlParams: {file: \'' + $('#bamUrlInput').val() + '\'}\n' +
        '})';
    // Add other variable parameters
    trackString = modify ? trackString : trackString + '\n})';
    const name = modify ? object.name : $("#bamNameInput").val();
    const info = modify ? object.description : $('#bamInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('bam', ['bam']);
    }
    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'bam', '#bamTracks');
            bam.push(track);
            console.log('BAM track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseBAM').collapse('show');
    }
}

function addBigwigTrack(modify, object) {
    const modalId = '#bigwigModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.File.ftpBIGWIG.extend({\n' +
        'name: \'' + $('#bigwigNameInput').val() + '\',\n' +
        'info: \'' + $('#bigwigInfoInput').val() + '\',\n' +
        "model: Genoverse.Track.Model.File.ftpBIGWIG.extend({" +
        'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=bigwig\',\n' +
        'urlParams: {file: \'' + $('#bigwigUrlInput').val() + '\'}' +
        '\n})' +
        '\n})';
    const name = modify ? object.name : $('#bigwigNameInput').val();
    const info = modify ? object.description : $('#bigwigInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('bigwig', ['bw']);
    }

    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'bigwig', '#bigwigTracks');
            bigwig.push(track);
            console.log('BIGWIG track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseBIGWIG').collapse('show');
    }
}

function addGffTrack(modify, object) {
    const modalId = '#gffModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.File.GFF.extend({\n' +
        'name: \'' + $('#gffNameInput').val() + '\',\n' +
        'info: \'' + $('#gffInfoInput').val() + '\',\n' +
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
    const name = modify ? object.name : $("#gffNameInput").val();
    const info = modify ? object.description : $('#gffInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('gff', ['gff', 'gff3', 'gtf']);
    }

    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'gff', '#gffTracks');
            gff.push(track);
            console.log('GFF track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseGFF').collapse('show');
    }
}

function addVcfTrack(modify, object) {
    const modalId = '#vcfModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.File.VCF.extend({\n' +
        'name: \'' + $('#vcfNameInput').val() + '\',\n' +
        'info: \'' + $('#vcfInfoInput').val() + '\',\n' +
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
    const name = modify ? object.name : $("#vcfNameInput").val();
    const info = modify ? object.description : $('#vcfInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkTrack('vcf', ['vcf']);
    }
    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'vcf', '#vcfTracks');
            vcf.push(track);
            console.log('VCF track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseVCF').collapse('show');
    }
    console.log(trackString);
}

function addSnpDensityTrack(modify, object) {
    const modalId = '#snpDensityModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    // Make heterozygous track
    let trackString = modify ? object.data : 'Genoverse.Track.SNPDensity.extend({\n' +
        'name: \'' + $('#snpDensityNameInput').val() + '\',\n' +
        'info: \'' + $('#snpDensityInfoInput').val() + '\',\n' +
        'model: Genoverse.Track.Model.SNPDensity.extend({\n' +
        'url: \'' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix\',\n' +
        'largeFile: true,\n';

    if (!modify & $('#snpDensityBinsizeInput').val() !== '') {
        trackString += 'binSize: ' + $('#snpDensityBinsizeInput').val() + ',\n';
    }
    trackString = modify ? trackString : trackString + 'urlParams: {file: \'' + $('#snpDensityUrlInput').val() + '\'}\n' + '})';
    if (!modify & $('#snpDensityThresholdInput').val() !== '') {
        trackString += ',\nthreshold: ' + $('#snpDensityThresholdInput').val();
    }
    trackString = modify ? trackString : trackString + '\n})';
    const name = modify ? object.name : $('#snpDensityNameInput').val();
    const info = modify ? object.description : $('#snpDensityInfoInput').val();

    let valid = true;
    if (!modify) {
        valid = checkTrack('snpDensity', ['vcf']);
    }
    if (valid === true) {
        const track = { name: name, description: info, type: 'snpDensity', data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'snpDensity', '#snpDensityTracks');
            snpDensity.push(track);
            console.log('SNP track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseSNPDensity').collapse('show');
    }
}

function addGeneExpressionTrack(modify, object) {
    const modalId = '#geneExpressionModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    let trackString = modify ? object.data : 'Genoverse.Track.GeneExpression.extend({\n' +
        'name: \'' + $('#geneExpressionNameInput').val() + '\',\n' +
        'info: \'' + $('#geneExpressionInfoInput').val() + '\',\n'
        + 'model: Genoverse.Track.Model.GeneExpression.extend({\n'
        + 'url: "' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=tabix",\n'
        + 'urlParams: {file: "' + $('#geneExpressionGffUrlInput').val() + '"},\n'
        + 'urlRsem: "' + global_url + '/index/request?chr=__CHR__&start=__START__&end=__END__&type=rsem",\n'
        + 'urlParamsRsem: {file: "' + $('#geneExpressionRsemUrlInput').val() + '"}';

    if (!modify & $('#geneExpressionExpcountInput').val() !== '') {
        trackString += ',\nexpCountThreshold: ' + $('#geneExpressionExpcountInput').val();
    }
    trackString = modify ? trackString : trackString + '\n})';
    if (!modify & $('#geneExpressionThresholdInput').val() !== '') {
        trackString += ',\nthreshold: ' + $('#geneExpressionThresholdInput').val();
    }
    trackString = modify ? trackString : trackString + '\n})';
    console.log(trackString);
    const name = modify ? object.name : $('#geneExpressionNameInput').val();
    const info = modify ? object.description : $('#geneExpressionInfoInput').val();
    let valid = true;
    if (!modify) {
        valid = checkGeneExpressionTrack(name, info);
    }
    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'geneExpression', '#geneExpressionTracks');
            geneExpression.push(track);
            console.log('Gene expression track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseGeneExpression').collapse('show');
    }
}

function addCustomTrack(modify, object) {
    const modalId = '#customModal';
    // Check if we need to update the track
    const isUpdate = $(modalId).attr('trackId') !== undefined;

    const name = modify ? object.name : $("#customNameInput").val();
    const info = modify ? object.description : $("#customInfoInput").val();
    const trackString = modify ? object.data : $('#customText').val();
    let valid = true;
    if (!modify) {
        valid = checkCustomTrack(name, info, trackString);
    }

    if (valid === true) {
        const track = { name: name, description: info, data: trackString };

        // If it is an update, just update the list and the DOM
        if (isUpdate) {
            updateTrack(modalId, track);
        } else {
            // If not add to the DOM and the track list
            addDOMTrack(name, 'custom', '#customTracks');
            custom.push(track);
            console.log('Custom track added');
            trackCount++;
        }
        $(modalId).modal('hide');
        $('#collapseCUSTOM').collapse('show');
    }
}

/**
 * Function to add the track to the DOM
 * @param {*} name Name of the track
 * @param {*} trackType Type track
 * @param {*} id Id Element of the DOM where to add the list item
 */
function addDOMTrack(name, trackType, id) {
    // If not add to the DOM and the track list
    const listItem =
        '<div track id= "L' + trackCount + '" ></br>' +
        '<li>' +
        '<label class="normal">' + name + '</label>' +
        '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' +
        '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="modifyTrack(this, \'' + trackType + '\')" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-edit"></span></button>' +
        '</li></div>';
    $(id).append(listItem);
}

/**
 * Function to find the track and update it
 * Update the name of the track in the DOM
 * @param {*} modalId ModalId
 * @param {*} track Object of the new track
 */
function updateTrack(modalId, track) {
    const trackId = $(modalId).attr('trackId');
    const labelElement = $(`${trackId} label`);

    for (let i = 0; i < tracks.length; i++) {
        for (let j = 0; j < tracks[i].length; j++) {
            if (tracks[i][j].name === labelElement.text()) {
                tracks[i][j] = track;
                labelElement.text(track.name);
                console.log(`track ${track.name} updated`);
            }
        }
    }
}

//Find the species from Ensembl selector
function findSpecies() {
    // Get the species from Ensembl
    const species = document.querySelector("#genomic-species-select");
    return species[species.selectedIndex].value;
}

// Get the information of the upload genome
function uploadGenome() {
    return $(':file')[0].files[0];
}

// Find the the genome from the list selector
function findListGenome() {
    // Get the genome from the list
    const genome = document.querySelector("#genomic-files-select");
    return genome[genome.selectedIndex].value;
}

/////////////////////////////////////
//           SUMBIT FORM           //
/////////////////////////////////////

// Check the form when click on the button submit
function validate(boolean) {
    modify = boolean === 'true' ? true : false;
    const ensemblVisible = $("#ensembl").is(':visible');
    const genomeListVisible = $("#filechoose").is(':visible');
    const genomeUploadVisible = $("#upload").is(':visible');
    const err = [];
    let valide = true;

    // Get all the inputs of the chromosome
    const inputs = document.querySelectorAll("#inputs input");
    for (let i = 0; i < inputs.length; i++) {
        check[inputs[i].name](); // Check
        if (!check[inputs[i].name]()) {
            valide = false;
            if (inputs[i].name !== 'name') {
                err.push('- ' + inputs[i].name + ' field is empty');
            } else {
                err.push('- ' + inputs[i].name + ' field is empty or name is incorrect, acceptable are:\n\t- alphabetic characters, A to Z,\n\t- the 10 Arabic numerals, 0 to 9\n\t- "_", "-" or "space" character between words');
            }

        }
    }

    // Get the genome from Ensembl or file or list
    let genomeSelected;
    if (ensemblVisible) {
        genomeSelected = { name: findSpecies(), type: "ensembl" };
        if (!check["species"](genomeSelected))
            valide = false;
    } else if (genomeListVisible) {
        genomeSelected = { name: findListGenome(), type: "list" };
        if (!check["listGenome"](genomeSelected))
            valide = false;
        err.push('- genome is not selected');
    } else if (genomeUploadVisible) {
        const file = uploadGenome();
        genomeSelected = { name: file.name.slice(0, -3), type: "genome" };
        if (!check["uploadGenome"](genomeSelected, file.type.includes("javascript")))
            valide = false;
        err.push('- genome is not selected');
    } else {
        valide = false;
    }

    // Get all the plugins
    const pluginsElement = document.querySelectorAll("#plugins .material-switch input");
    const pluginsInfo = document.querySelectorAll("#plugins .list-group-item");
    const plugins = [];

    // Go through all the plugins to know if they are checked and push in the array
    for (let i = 0; i < pluginsElement.length; i++) {
        if (pluginsElement[i].checked) {
            plugins.push({ name: pluginsElement[i].name, checked: true, id: pluginsElement[i].id, info: pluginsInfo[i].title });
        } else {
            plugins.push({ name: pluginsElement[i].name, checked: false, id: pluginsElement[i].id, info: pluginsInfo[i].title });
        }
    }

    // Get all the tracks selected
    const tracksElement = document.querySelectorAll("#ensembl-tracks .list-group-item input, #tracks .list-group-item input");
    const tracksSelected = [];

    addDbsnpTrack();
    addGeneTrack();
    addSequenceTrack();

    // Add the tracks and check if they are selected or not
    for (let i = 0; i < tracksElement.length; i++) {
        if (tracksElement[i].checked) {
            tracksSelected.push({ group: nameTracks[i], checked: true, trackChildren: tracks[i] });
        } else {
            tracksSelected.push({ group: nameTracks[i], checked: false, trackChildren: tracks[i] });
        }
    }

    // If no error in the inputs
    if (valide) {
        const data = {};
        // Add all the information in the object
        data.plugins = plugins;
        data.genome = genomeSelected;
        data.name = inputs[0].value;
        data.description = inputs[1].value;
        data.chromosome = inputs[2].value;
        data.start = inputs[3].value;
        data.end = inputs[4].value;
        data.tracks = tracksSelected;

        // If it is modified page
        if (modify) {
            data.previous = decodeURIComponent(location.href).match(/name=([^&?]*)/)[1];

            // If it is an upload file
            if (genomeUploadVisible) {
                readFile(file, function (content) {
                    data.file = { filename: file.name, content: content };
                    console.log(data);
                    sendData(data, global_url + '/modify');
                });
            } else {
                console.log(data);
                sendData(data, global_url + '/modify');
            }
            // If it is instance page
        } else {
            // If it is an upload file
            if (genomeUploadVisible) {
                readFile(file, function (content) {
                    data.file = { filename: file.name, content: content };
                    console.log(data);
                    sendData(data, global_url + '/instance');
                });
            } else {
                console.log(data);
                sendData(data, global_url + '/instance');
            }
        }
    } else {
        errMessage(err);
    }

}

// Read the uploaded file to get the content
function readFile(file, cb) { // We pass a callback as parameter
    let content = "";
    const reader = new FileReader();

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
            console.log('Process SUCCESS');
            console.log(JSON.stringify(data));
            if (data === 'done') {
                window.location.href = "/";
            } else if (data === 'name') {
                alert('Instance Name Already Exist');
            } else {
                alert('Error Creating the Instance');
            }
        },
        error: function () {
            console.log('Process ERROR');
        }
    });
}

function errMessage(err) {
    if (err.length > 1) {
        err = err.join('\n\n');
        alert('Please fill in the form correctly:\n\n\n' + err);
    } else if (err.length === 1) {
        alert('\t\tPlease fill in the form correctly:\n\n' + err);
    }
}

/**
 * Functions to check if the form is filled properly
 * If not change the background color
 */
const check = {};
check['info'] = function () {
    const info = document.getElementById("project-info-input");

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
    const name = document.getElementById("project-name-input");
    const alphanumeric = /^\w+([ _-]?\w+)*$/;

    // Not empty and alphanumeric
    if (name.value.match(alphanumeric)) {
        name.style.background = "white";
        return true;
    } else {
        name.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['chromosome'] = function () {
    const chrom = document.getElementById("chromosome-input");

    // Chromosome greater than 0 and not empty
    if (chrom.value !== "") {
        return true;
    } else {
        chrom.value = 1;
        return true;
    }
};

check['start'] = function () {
    const start = document.getElementById("genomic-start-input");

    // Start greater or equal to 0 and not empty
    if (start.value !== "") {
        return true;
    } else {
        start.value = 1;
        return true;
    }
};

check['end'] = function () {
    const end = document.getElementById("genomic-end-input");

    // End greater than the start value and not empty
    if (end.value !== "") {
        return true;
    } else {
        end.value = 10000;
        return true;
    }
};

check['species'] = function (value) {
    const species = document.getElementById("genomic-species-select");
    if (value) {
        species.style.background = "white";
        return true;
    } else {
        species.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['listGenome'] = function (value) {
    const genome = document.getElementById("genomic-files-select");
    if (value.name) {
        genome.style.background = "white";
        return true;
    } else {
        genome.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};

check['uploadGenome'] = function (value, fileType) {
    const genome = document.getElementById("upload-input");
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

/**
 * Check if inputs are filled, properly prompted and have good extension
 * @param {*} trackType Track type
 * @param {*} ext List of extensions to check
 */
function checkTrack(trackType, ext) {

    //check extension
    const extCall = checkExtension($('#' + trackType + 'UrlInput').val(), ext);

    //error messages
    const errTrack = [];

    let valid = true;

    // Get all the track added in the DOM
    const tracksList = $('div[track]');

    // Check if name already exists
    // Compare each id added into the modal to the current track to check if we update the same
    // If we do not update the track then check if the name already exists
    // If it is true throw an error to the user
    tracksList.each(function () {
        if (`#${$(this).attr('id')}` !== $(`#${trackType}Modal`).attr('trackId') &&
            $('label', this).text() === $('#' + trackType + 'NameInput').val()) {
            valid = false;
            $('#' + trackType + 'NameInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errTrack.push('- name already exists. It must be unique.');
            return false;
        } else {
            $('#' + trackType + 'NameInput').css({ 'background-color': "white" });
        }
    });

    if ($('#' + trackType + 'NameInput').val() === '') {
        valid = false;
        $('#' + trackType + 'NameInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errTrack.push('- name field is empty');
    } else if (valid) {
        $('#' + trackType + 'NameInput').css({ 'background-color': "white" });
    }
    if ($('#' + trackType + 'InfoInput').val() === '') {
        valid = false;
        $('#' + trackType + 'InfoInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errTrack.push('- info field is empty');
    } else {
        $('#' + trackType + 'InfoInput').css({ 'background-color': "white" });
    }
    if ($('#' + trackType + 'UrlInput').val() === '') {
        valid = false;
        $('#' + trackType + 'UrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errTrack.push('- url/file path is missing');
    } else {
        if (extCall === false) {
            valid = false;
            $('#' + trackType + 'UrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errTrack.push('- url/file path is incorrect, acceptable file\nextension(s): ' + ext);
        } else {
            $('#' + trackType + 'UrlInput').css({ 'background-color': "white" });
        }
    }
    if ($('#' + trackType + 'ThresholdInput')) {
        if (Number($('#' + trackType + 'ThresholdInput').val()) > 100000000) {
            valid = false;
            $('#' + trackType + 'ThresholdInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errTrack.push('threshold value is incorrect');
        } else {
            $('#' + trackType + 'ThresholdInput').css({ 'background-color': "white" });
        }
    }
    if ($('#' + trackType + 'MaxqualInput')) {
        if (Number($('#' + trackType + 'MaxqualInput').val()) > 10000) {
            valid = false;
            $('#' + trackType + 'MaxqualInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errTrack.push('max quality value is incorrect');
        } else {
            $('#' + trackType + 'MaxqualInput').css({ 'background-color': "white" });
        }
    }

    errMessage(errTrack);

    return valid;
}

function checkExtension(filepath, ext) {
    const getExt = filepath.toLowerCase().split('.');
    let found = false;
    for (let i = 0; i < ext.length; i++) {
        if (getExt.indexOf(ext[i]) > -1) {
            found = true;
            break;
        }
    }
    return found;
}

function checkGeneExpressionTrack(name, info, isUpdate) {
    let valid = true;
    const gffUrl = $('#geneExpressionGffUrlInput').val();
    const rsemUrl = $('#geneExpressionRsemUrlInput').val();

    //check extensions
    const extCallGffGeneExpressionTrack = checkExtension(gffUrl, ['gff', 'gff3', 'gtf']);
    const extCallRsemGeneExpressionTrack = checkExtension(rsemUrl, ['results']);
    //error messages
    const errGeneExpressionTrack = [];

    // Get all the track added in the DOM
    const tracksList = $('div[track]');

    // Check if name already exists
    // Compare each id added into the modal to the current track to check if we update the same
    // If we do not update the track then check if the name already exists
    // If it is true throw an error to the user
    tracksList.each(function () {
        if (`#${$(this).attr('id')}` !== $('#geneExpressionModal').attr('trackId') &&
            $('label', this).text() === $('#geneExpressionNameInput').val()) {
            valid = false;
            $("#geneExpressionNameInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
            errGeneExpressionTrack.push('- name already exists. It must be unique.');
            return false;
        } else {
            $("#geneExpressionNameInput").css({ 'background-color': "white" });
        }
    });

    if (name === '') {
        valid = false;
        $("#geneExpressionNameInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
        errGeneExpressionTrack.push('- name field is empty');
    } else if (valid) {
        $("#geneExpressionNameInput").css({ 'background-color': "white" });
    }
    if (info === '') {
        valid = false;
        $("#geneExpressionInfoInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
        errGeneExpressionTrack.push('- info field is empty');
    } else {
        $("#geneExpressionInfoInput").css({ 'background-color': "white" });
    }
    if (rsemUrl === '') {
        valid = false;
        $('#geneExpressionRsemUrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errGeneExpressionTrack.push('- RSEM results field is empty');
    } else {
        if (extCallRsemGeneExpressionTrack === false) {
            valid = false;
            $('#geneExpressionRsemUrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errGeneExpressionTrack.push('- url/file path is incorrect, acceptable file\nextension: results');
        } else {
            $('#geneExpressionRsemUrlInput').css({ 'background-color': "white" });
        }
    }

    if (gffUrl === '') {
        valid = false;
        $('#geneExpressionGffUrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errGeneExpressionTrack.push('- url/file path is missing');
    } else {
        if (extCallGffGeneExpressionTrack === false) {
            valid = false;
            $('#geneExpressionGffUrlInput').css({ 'background-color': "rgba(255,0,51,0.6)" });
            errGeneExpressionTrack.push('- url/file path is incorrect, acceptable file\nextension: gff, gtf or gff3');
        } else {
            $('#geneExpressionGffUrlInput').css({ 'background-color': "white" });
        }
    }

    errMessage(errGeneExpressionTrack);
    return valid;
}

function checkCustomTrack(name, info, trackString) {
    let valid = true;

    //error messages
    const errCustomTrack = [];

    // Get all the track added in the DOM
    const tracksList = $('div[track]');

    // Check if name already exists
    // Compare each id added into the modal to the current track to check if we update the same
    // If we do not update the track then check if the name already exists
    // If it is true throw an error to the user
    tracksList.each(function () {
        if (`#${$(this).attr('id')}` !== $('#customModal').attr('trackId') &&
            $('label', this).text() === $('#customNameInput').val()) {
            valid = false;
            $("#customNameInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
            errCustomTrack.push('- name already exists. It must be unique.');
            return false;
        } else {
            $("#customNameInput").css({ 'background-color': "white" });
        }
    });

    if (name === '') {
        valid = false;
        $("#customNameInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
        errCustomTrack.push('- name field is empty');
    } else {
        $("#customNameInput").css({ 'background-color': "white" });
    }
    if (info === '') {
        valid = false;
        $("#customInfoInput").css({ 'background-color': "rgba(255,0,51,0.6)" });
        errCustomTrack.push('- info field is empty');
    } else {
        $("#customInfoInput").css({ 'background-color': "white" });
    }
    if (trackString === '' || trackString === 'Genoverse.Track.extend ({\nid:\nname:\nmodel:\ninfo:\nurl:\n\nlabels: false\n}),') {
        valid = false;
        $('#customText').css({ 'background-color': "rgba(255,0,51,0.6)" });
        errCustomTrack.push('- track details field is empty');
    } else {
        $("#customText").css({ 'background-color': "white" });
    }

    errMessage(errCustomTrack);
    return valid;
}