Genoverse.Plugins.search = function () {
    this.controls.push({
        icon: '<i class="fa fa-search"></i>',
        'class': 'gv-search',
        name: 'Search by position or gene',
        action: function (browser) {
            // Resetting variables
            var searchButton = this;
            var start = 0;
            var end = 0;
            var gene = '';
            var matchingGenes = [];
            var matchingPos = [];
            var featuresENS = [];
            var featuresGFF = [] ;
            // If the control panel search button has already been clicked, it will close the search menu
            if ($(searchButton).hasClass('gv-active')) {
                $('.gv-menu.gv-search-menu .gv-close').trigger('click');
                $(this).removeClass('gv-active');
            } else {
                // otherwise it will open the search menu
                var searchMenu = $(this).data('searchMenu');
                if (searchMenu) {
                    searchMenu.show();
                } else {
                    searchMenu = makeSearchMenu();
                }
                $(searchButton).addClass('gv-active');
                // When gene-search button is clicked, set new position and search genes
                $('.gv-gene-search-button', searchMenu).on('click', function () {
                    start = Number($('#start-search').val());
                    end = Number($('#end-search').val());
                    gene = $('#gene-name').val();
                    // If start and end undefined, set them to search the whole chromosome
                    if (start == 0 && end == 0 && gene != '') {
                        start = 1;
                        end = browser.chromosomeSize;
                    }

                    if (start < end) {
                        browser.moveTo(browser.chr, start, end, true);
                        $('.gv-menu.gv-search-menu .gv-close').trigger('click');
                        if (gene != '') {

                            window.setTimeout(function () {
                                getMatchingGenes();
                                var geneMenu = $(this).data('geneMenu');
                                if (geneMenu) {
                                    geneMenu.css("display", "none")
                                } else {
                                    geneMenu = makeGeneMenu()
                                }
                                $('.gv-gene-menu').draggable();
                                // Get gene names and positions
                                var geneNames = $('.gv-gene-names', geneMenu).data({
                                    listGenes: function () {
                                        for (var i = 0; i < matchingGenes.length; i++) {
                                            $('<div>')
                                                    .append('<li data-id="' + i + '">' + matchingGenes[i] + '</li>')
                                                    .appendTo(geneNames);
                                        }
                                    }});
                                var genePositions = $('.gv-gene-positions', geneMenu).data({
                                    listPositions: function () {
                                        for (var i = 0; i < matchingGenes.length; i++) {
                                            $('<div>')
                                                    .append('<span> ' + matchingPos[i] + '</span>')
                                                    .appendTo(genePositions);
                                        }
                                    }});
                                // Set the data in the menu
                                geneNames.empty();
                                genePositions.empty();
                                geneNames.data('listGenes')();
                                genePositions.data('listPositions')();
                                window.setTimeout(function () {
                                    geneMenu.show();
                                }, 100);
                                // Set the scrollbar and selection of gene menu
                                if (matchingGenes.length > 30) {
                                    setScrollBar();
                                } else {
                                    removeScrollBar();
                                }
                                $("li").css({"cursor": "pointer"});
                                $('li', geneMenu).click(function () {
                                    var index = $(this).data('id');
                                    var positions = matchingPos[index].split(' - ');
                                    browser.moveTo(browser.chr, positions[0], positions[1], true);
                                });
                                $(this).data('geneMenu', geneMenu);
                            }, 500);
                        }
                    }
                });
                $('.gv-close', searchMenu).on('click', function () {
                    $(searchButton).removeClass('gv-active');
                });
                $(this).data('searchMenu', searchMenu);
            }


            function makeSearchMenu() {
                var searchMenu = browser.makeMenu({
                    'Search by position:': 'Search by gene:',
                    '<input id="start-search" placeholder="Start position">': '<input id="gene-name" placeholder="Gene">',
                    '<input id="end-search" placeholder="End position">': 'Search: <div class="gv-gene-search-button gv-menu-button fa fa-arrow-circle-right"></div>'
                }).addClass('gv-search-menu');
                return searchMenu;
            }


            function makeGeneMenu() {
                var geneMenu = browser.makeMenu({
                    'Gene Name:': 'Position:',
                    '<div id="names" class="gv-gene-names"></div>': '<div id="pos" class="gv-gene-positions"></div>'
                }).addClass('gv-gene-menu');
                return geneMenu;
            }


            function getMatchingGenes() {
                for (var i = 0; i < browser.tracks.length; i++) {
                    if (browser.tracks[i].id == "genes") { // for ensembl
                        featuresENS = browser.tracks[i].model.findFeatures(browser.chr, start, end);
                        for (var j = 0; j < featuresENS.length; j++) {
                            if (featuresENS[j].external_name.includes(gene.toUpperCase()) || featuresENS[j].external_name.includes(gene.toLowerCase()) || featuresENS[j].external_name.includes(gene)) {
                                matchingGenes.push(featuresENS[j].external_name);
                                matchingPos.push(featuresENS[j].start + ' - ' + featuresENS[j].end);
                            }
                            if (featuresENS[j].id.includes(gene.toUpperCase()) || featuresENS[j].id.includes(gene.toLowerCase()) || featuresENS[j].external_name.includes(gene)) {
                                matchingGenes.push(featuresENS[j].id);
                                matchingPos.push(featuresENS[j].start + ' - ' + featuresENS[j].end);
                            }
                        }
                    } else if (browser.tracks[i].id == "gff") { // for gff
                        featuresGFF = browser.tracks[i].model.findFeatures(browser.chr, start, end);
                        for (var j = 0; j < featuresGFF.length; j++) {
                            if (featuresGFF[j].id.includes(gene.toUpperCase()) || featuresGFF[j].id.includes(gene.toLowerCase()) || featuresGFF[j].id.includes(gene)) {
                                matchingGenes.push(featuresGFF[j].id);
                                matchingPos.push(featuresGFF[j].start + ' - ' + featuresGFF[j].end);
                            }
                        } 
                    }
                }

            }
        }});
};
function setScrollBar() {
    $('#pos').css({"height": "500px"});
    $('#names').css({"height": "500px"});
    $('#pos').css({"overflow-y": "scroll"});
    $('#names').css({"overflow-y": "hidden"});
    $('#pos').on('scroll', function () {
        $('#names').scrollTop($(this).scrollTop());
    });
}


function removeScrollBar() {
    $('#pos').css({"height": "auto"});
    $('#names').css({"height": "auto"});
    $('#pos').css({"overflow-y": "hidden"});
    $('#names').css({"overflow-y": "hidden"});
}

Genoverse.Plugins.search.requires = 'controlPanel';