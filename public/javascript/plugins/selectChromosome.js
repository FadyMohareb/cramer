Genoverse.Plugins.selectChromosome = function () {
    this.controls.push({
        icon: '<h4>Chr</h4>',
        'class': 'gv-select-chr',
        name: 'Switch between chromosomes in the genome',
        action: function (browser) {
            $( '.gv-select-chr' ).replaceWith( "<div class='gv-select-chr'><select align='centre' id='select' class='gv-chr-list'></select></div>" );

                //number of chromosomes
                var genome = browser.genome;
                var count = 0;
                for (var chr in genome) {
                    if (genome.hasOwnProperty(chr))
                        ++count;
                }

                var chrList = $('.gv-chr-list').data({
                    chromosomesList: function () {
                        for (var i = 0; i < count; i++) {
                            $('#select').append('<option value="' + i + '">' + Object.keys(genome)[i] + '</option>');
                        }
                    }
                });

                chrList.empty().data('chromosomesList')();

                $('#select').on('click', function () {
                    var index = $(this).val();
                    browser.moveTo(Object.keys(genome)[index], browser.start, browser.end, true);
                });

        }
    });
};

Genoverse.Plugins.selectChromosome.requires = 'controlPanel';
