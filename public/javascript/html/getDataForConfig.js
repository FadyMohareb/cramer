var $ = jQuery;
var tracks = [scalebar = [], chromosome = [], ensembl = [], dbsnp = [], bed = [], bigbed = [], bam = [], gff = [], vcf = [], wig = [], bigwig = [], custom = []];
var trackCount = 0;

function toggleSpecies() {
    $("#toggleButton").text(function (i, old) {
        return old === 'Ensembl' ? 'Upload File' : 'Ensembl';
    });
    $("#ensembl").toggle();
    $("#upload").toggle();
}

function removeTrack(item) {
    console.log('track deleted');
    var id = '#L' + $(item).data('id');
    var name = $(id).text();
    console.log(name);
    $(id).remove();
    for (var i = 0; i < tracks.length; i++) {
        for (j = 0; j < tracks[i].length; j++) {
            if (tracks[i][j].name === name) {
                console.log(tracks[i][j]);
                tracks[i].splice(j, 1);
            }
        }
    }
}

function addCustomTrack() {
    console.log('custom track added');
    var name = $("#customNameInput").val();
    var info = $("#customInfoInput").val();
    var track = {name: name, description: info, string: $('#customText').val()};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#customTracks').append(listItem);
    custom.push(track);
    trackCount++;
    console.log(tracks);
}

function addBedTrack() {
    console.log('bed track added');
    var trackString = 'Genoverse.Track.File.BED.extend({\nname: \''
            + $('#bedNameInput').val() + '\',\ninfo: \''
            + $('#bedInfoInput').val() + '\',\nurl: \''
            + $('#bedUrlInput').val() + '\'\n});';
    var name = $("#bedNameInput").val();
    var info = $('#bedInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#bedTracks').append(listItem);
    bed.push(track);
    trackCount++;
    console.log(tracks);
}

function addBigbedTrack() {
    console.log('bigbed track added');
    var trackString = 'Genoverse.Track.File.BIGBED.extend({\nname: \''
            + $('#bigbedNameInput').val() + '\',\ninfo: \''
            + $('#bigbedInfoInput').val() + '\',\nurl: \''
            + $('#bigbedUrlInput').val() + '\'\n});';
    var name = $("#bigbedNameInput").val();
    var info = $('#bigbedInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#bigbedTracks').append(listItem);
    bigbed.push(track);
    trackCount++;
    console.log(tracks);
}

function addBamTrack() {
    var trackString = 'Genoverse.Track.File.BAM.extend({\nname: \''
            + $('#bamNameInput').val().replace(/\s/g, '</br>') + '\',\ninfo: \''
            + $('#bamInfoInput').val() + '\',\nurl: \''
            + $('#bamUrlInput').val() + '\'';
    // Add other variable parameters
    trackString = trackString + '\n});';
    var name = $("#bamNameInput").val();
    var info = $('#bamInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#bamTracks').append(listItem);
    bam.push(track);
    trackCount++;
    console.log(tracks);
}

function addGffTrack() {
    console.log('gff track added');
    var trackString = 'Genoverse.Track.File.GFF.extend({\nname: \''
            + $('#gffNameInput').val() + '\',\ninfo: \''
            + $('#gffInfoInput').val() + '\',\nurl: \''
            + $('#gffUrlInput').val() + '\'';
    // Add other variable parameters
    trackString = trackString + '\n});';
    var name = $("#gffNameInput").val();
    var info = $('#gffInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#gffTracks').append(listItem);
    gff.push(track);
    trackCount++;
    console.log(tracks);
}

function addVcfTrack() {
    console.log('vcf track added');
    var trackString = 'Genoverse.Track.File.VCF.extend({\nname: \''
            + $('#vcfNameInput').val() + '\',\ninfo: \''
            + $('#vcfInfoInput').val() + '\',\nurl: \''
            + $('#vcfUrlInput').val() + '\'';
    if ($('#vcfThresholdInput').val() != '') {
        trackString = trackString + ',\nthreshold: ' + $('#vcfThresholdInput').val();
    }
    if ($('#vcfMaxqualInput').val() != '') {
        trackString = trackString + ',\nmaxQual: ' + $('#vcfMaxqualInput').val();
    }
    trackString = trackString + '\n});';
    var name = $("#vcfNameInput").val();
    var info = $('#vcfInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#vcfTracks').append(listItem);
    vcf.push(track);
    trackCount++;
    console.log(tracks);
}

function addWigTrack() {
    console.log('wig track added');
    var trackString = 'Genoverse.Track.File.WIG.extend({\nname: \''
            + $('#wigNameInput').val() + '\',\ninfo: \''
            + $('#wigInfoInput').val() + '\',\nurl: \''
            + $('#wigUrlInput').val() + '\'\n});';
    var name = $("#wigNameInput").val();
    var info = $('#wigInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#wigTracks').append(listItem);
    wig.push(track);
    trackCount++;
    console.log(tracks);
}

function addBigwigTrack() {
    console.log('bigwig track added');
    var trackString = 'Genoverse.Track.File.BIGWIG.extend({\nname: \''
            + $('#bigwigNameInput').val() + '\',\ninfo: \''
            + $('#bigwigInfoInput').val() + '\',\nurl: \''
            + $('#bigwigUrlInput').val() + '\'\n});';
    var name = $('#bigwigNameInput').val();
    var info = $('#bigwigInfoInput').val();
    var track = {name: name, description: info, string: trackString};
    // Add to list
    var listItem = '<div id= "L' + trackCount + '" ></br><li>' + name + '<button type="button"' + 'data-id=\'' + trackCount + '\' onClick="removeTrack(this)" class="btn btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button>' + '</li></div>';
    $('#bigwigTracks').append(listItem);
    bigwig.push(track);
    trackCount++;
    console.log(tracks);
}

function basicTrack() {
    if ($('#ensembl').is(":visible")) {
        gene.push({name: 'scalebar', description: "", string: "Genoverse.Track.Scalebar.extend({};"});
    } else {
        gene.push({name: 'scalebar', description: "", string: "Genoverse.Track.Scalebar.extend({};"});
    }
    scalebar.push({name: 'scalebar', description: "", string: "Genoverse.Track.Scalebar;"});
}

// Check the form when click on the button submit
function validate(modify) {

    var valide = true;

    // Get all the inputs of the chromosome
    var inputs = document.querySelectorAll("#inputs input");
    for (var i = 0; i < inputs.length; i++) {
        check[inputs[i].name](); // Check
        if (!check[inputs[i].name]()) {
            valide = false;
        }
    }

    // Get the species from Ensembl or Fasta file
    var species = document.querySelector("#genomic-species-select");
    var speciesSelected = species[species.selectedIndex].value;
    check["species"](speciesSelected);

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
    var tracksElement = document.querySelectorAll("#tracks .list-group-item input");
    var tracksLength = tracksElement.length;
    var tracksSelected = [];
    console.log(tracks);
    for (var i = 0; i < tracksLength; i++) {
        if (tracksElement[i].checked) {
            tracksSelected.push({group: tracksElement[i].name, checked: true, trackChildren: tracks[i]});
        } else {
            tracksSelected.push({group: tracksElement[i].name, checked: false, trackChildren: tracks[i]});
        }
    }

//    basicTrack(speciesSelected);

    if (valide) {
        if (modify) {
            var url = new URL(window.location.href);
            var previousName = url.searchParams.get("name");
            console.log(previousName);

            var data = {};
            data.previous = previousName;
            data.plugins = plugins;
            data.genome = speciesSelected;
            data.name = inputs[0].value;
            data.description = inputs[1].value;
            data.chromosome = inputs[2].value;
            data.start = inputs[3].value;
            data.end = inputs[4].value;
            data.tracks = tracksSelected;
            console.log(data);
            sendData(data, 'http://localhost:4000/modify');

        } else {
            var data = {};
            data.plugins = plugins;
            data.genome = speciesSelected;
            data.name = inputs[0].value;
            data.description = inputs[1].value;
            data.chromosome = inputs[2].value;
            data.start = inputs[3].value;
            data.end = inputs[4].value;
            data.tracks = tracksSelected;
            console.log(data);
            sendData(data, 'http://localhost:4000/instance');
        }
    } else {
        alert('Fill properly the form');
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

check['species'] = function (value) {
    var species = document.getElementById("genomic-species-select");

    if (value !== "") {
        species.style.background = "white";
        return true;
    } else {
        species.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};