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
            var features = [];

            // If the search button has already been clicked, it will close the search menu
            if ($(searchButton).hasClass('gv-active')) {
                $('.gv-menu.gv-search-menu .gv-close').trigger('click');
                // Unclick the search button
                $(this).removeClass('gv-active');

            } else {
                // otherwise it will open the search menu
                var searchMenu = $(this).data('searchMenu');

                if (searchMenu) {
                    searchMenu.show();
                } else {
                    // If no menu created, create a new menu from template in genoverse.js
                    searchMenu = browser.makeMenu({
                        'Search by position:': 'Search by gene:',
                        '<input id="start-search" placeholder="Start position">': '<input id="gene-name" placeholder="Gene">',
                        '<input id="end-search" placeholder="End position">': 'Search: <div class="gv-gene-search-button gv-menu-button fa fa-arrow-circle-right"></div>'
                    }).addClass('gv-search-menu');
                }
                // Set search button as clicked
                $(searchButton).addClass('gv-active');

                // When gene-search button is clicked, set new position and search genes
                $('.gv-gene-search-button', searchMenu).on('click', function () {

                    // Get variables from input fields
                    start = Number($('#start-search').val());
                    end = Number($('#end-search').val());
                    gene = $('#gene-name').val();

                    // If start and end undefined, set them to search the whole chromosome
                    if (start == 0 && end == 0 && gene != '') {
                        start = 1;
                        end = browser.chromosomeSize;
                    }

                    if (start < end) {
                        // Move to new position and close menu
                        browser.moveTo(browser.chr, start, end, true);
                        $('.gv-menu.gv-search-menu .gv-close').trigger('click');

                        if (gene != '') {
                            for (var i = 0; i < browser.tracks.length; i++) {
                                if (browser.tracks[i].id == "genes") {
                                    features = browser.tracks[i].model.findFeatures(browser.chr, start, end);
                                    console.log(browser.chr);
                                    console.log(start);
                                    console.log(end);
                                    console.log(features);
                                }
                            }
                            for (var i = 0; i < features.length; i++) {
                                if (features[i].external_name.includes(gene)) {
                                    matchingGenes.push(features[i].external_name);
                                    matchingPos.push(features[i].start + ' - ' + features[i].end);
                                }
                            }

                            // Open gene menu
                            var geneMenu = $(this).data('geneMenu');

                            if (geneMenu) {
                                geneMenu.show();
                            } else {
                                // If no menu created, create a new menu from template in genoverse.js
                                geneMenu = browser.makeMenu({
                                    'Gene Name:': 'Position:',
                                    '<div id="names" class="gv-gene-names"></div>': '<div id="pos" class="gv-gene-positions"></div>'
                                }).addClass('gv-gene-menu');
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
                                }
                            });
                            var genePositions = $('.gv-gene-positions', geneMenu).data({
                                listPositions: function () {
                                    for (var i = 0; i < matchingGenes.length; i++) {
                                        $('<div>')
                                                .append('<span> ' + matchingPos[i] + '</span>')
                                                .appendTo(genePositions);
                                    }
                                }
                            });
                            
                            // Set the data in the menu
                            geneNames.empty().data('listGenes')();
                            genePositions.empty().data('listPositions')();
                            
                            // If there are more than 30 genes, set the menu to have a scrollbar
                            if (matchingGenes.length > 30) {
                                $('#pos').css({"height": "500px"});
                                $('#names').css({"height": "500px"});
                                $('#pos').css({"overflow-y": "scroll"});
                                $('#names').css({"overflow-y": "hidden"});

                                $('#pos').on('scroll', function () {
                                    $('#names').scrollTop($(this).scrollTop());
                                });

                            } else {
                                $('#pos').css({"height": "auto"});
                                $('#names').css({"height": "auto"});
                                $('#pos').css({"overflow-y": "hidden"});
                                $('#names').css({"overflow-y": "hidden"});
                            }
                            
                            // Set it so you can click on the genes and move to other positions
                            $("li").css({"cursor": "pointer"});
                            $('li', geneMenu).click(function () {
                                var index = $(this).data('id');
                                var positions = matchingPos[index].split(' - ');
                                browser.moveTo(browser.chr, positions[0], positions[1], true);
                            });
                        }
                    }
                    // Set the data for the menu
                    $(this).data('geneMenu', geneMenu);
                });
                
                // Set the close button
                $('.gv-close', searchMenu).on('click', function () {
                    $(searchButton).removeClass('gv-active');
                });
                // Set the data for the menu
                $(this).data('searchMenu', searchMenu);

            }
        }
    });
};

Genoverse.Plugins.search.requires = 'controlPanel';