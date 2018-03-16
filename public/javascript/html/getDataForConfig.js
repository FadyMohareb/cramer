var $ = jQuery;

function toggleSpecies() {
    $("#toggleButton").text(function (i, old) {
        return old == 'Ensembl' ? 'Upload File' : 'Ensembl';
    });
    $("#ensembl").toggle();
    $("#upload").toggle();
}

// Check the form when click on the button submit
function validate() {

    var valide = true;

    // Get all the inputs of the chromosome
    var inputs = document.querySelectorAll("#inputs input");
    for (var i = 0; i < 3; i++) {
        check[inputs[i].name](); // Check
        if (!check[inputs[i].name]()) {
            valide = false;
        }
    }

    // Get the species from Ensembl or Fasta file
    var species = document.querySelector("#genomic-species-select");
//                                    check[species.name]();

    // Get all the plugins
    var plugins = document.querySelectorAll("#plugins .material-switch input"),
            pluginsLength = plugins.length,
            pluginsSelected = [];

    // Go through all the plugins to know if they are checked and push in the array
    for (var i = 0; i < pluginsLength; i++) {
        if (plugins[i].checked) {
            pluginsSelected.push(plugins[i].name);
        }
    }


    if (valide) {
        var data = {};
        data.plugins = pluginsSelected;
        data.chromosome = inputs[0].value;
        data.start = inputs[1].value;
        data.end = inputs[2].value;
        sendData(data);
    } else {
        alert('Fill properly the form');
    }


}

function sendData(data) {
    console.log("Try to send");

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:4000/instance',
        success: function (data) {
            console.log('success');
            console.log(JSON.stringify(data));
            if (data === 'done')
            {
                window.location.href = "/index";
            } else {
                alert('Error In Loading Config');
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

check['species'] = function () {
    var species = document.getElementById("genomic-species-select");

    if (species.value !== "") {
        species.style.background = "white";
        return true;
    } else {
        species.style.backgroundColor = "rgba(255,0,51,0.6)";
        return false;
    }
};


