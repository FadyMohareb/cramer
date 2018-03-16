Genoverse.Plugins.selectChromosome = function () {
    this.controls.push({
        icon: '<i class="fa fa-list-ul"></i>',
        'class': 'gv-select-chr',
        name: 'Select chromosome',
        action: function (browser) {
            var button = this;

            if ($(this).hasClass('gv-active')) {
                $('.gv-menu.gv-select-menu .gv-close').trigger('click');
                $(this).removeClass('gv-active');
            } else {

                var selectChr = $(this).data('selectChr');

                if (selectChr) {
                    selectChr.show();
                } else {
                    selectChr = browser.makeMenu({
                        'Select chromosome:': '',
                        '<div align="center"><select id="select" class="gv-chr-list"></select></div>': ''
                    }).addClass('gv-select-menu');
                }

                $(this).addClass('gv-active');

                selectChr.css({top: "50%", left: "50%", marginLeft: "-100px", marginTop: "-100px"});

                //number of chromosomes
                var genome = browser.genome;
                var count = 0;
                for (var chr in genome) {
                    if (genome.hasOwnProperty(chr))
                        ++count;
                }

                var chrList = $('.gv-chr-list', selectChr).data({
                    chromosomesList: function () {
                        for (var i = 0; i < count; i++) {
                            $('select').append('<option value="' + i + '">' + Object.keys(genome)[i] + '</option>');
                        }

                    }
                });


                chrList.empty().data('chromosomesList')();


                $('#select').change(function () {
                    var index = $(this).val();
                    browser.moveTo(Object.keys(genome)[index], browser.start, browser.end, true);
                });

                $(this).data('selectChr', selectChr);

            }
            $('.gv-close', selectChr).on('click', function () {
                $(button).removeClass('gv-active');
            });
        }
    });
};

Genoverse.Plugins.selectChromosome.requires = 'controlPanel';
