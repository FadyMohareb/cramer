Genoverse.Track.GeneExpression= Genoverse.Track.Graph.Bar.extend({
  name          : 'Gene Expression',
  model         : Genoverse.Track.Model.GeneExpression,
  height        : 100,
  threshold     : 100000000,
  
  populateMenu: function (features) {
    if (!features.length) {
      return [];
    }
    
    var start = features[0].start;
    var end   = features[features.length - 1].end;
    var avg   = features[0].start !== features[features.length - 1].start;
    var menu  = { title: features[0].id /* added so gene ids is displayed */ };
    var values, i;

    function getValues(_features) {
      var values = _features.map(function (f) { return f.height; }).sort(function (a, b) { return a - b; });

      return {
        avg: values.reduce(function (n, v) { return n + v; }, 0) / values.length,
        min: values[0],
        max: values[values.length - 1]
      };
    }

    if (avg) {
      if (features.length === 1) {
        values = getValues(features);

        menu['Average value'] = values.avg;
        menu['Min value']     = values.min;
        menu['Max value']     = values.max;
      } else {
        menu = [ menu ];

        var datasets = this.prop('datasets');
        var featuresByDataset;

        if (datasets.length) {
          featuresByDataset = datasets.reduce(function (hash, d) { hash[d.name] = []; return hash; }, {});

          for (i = 0; i < features.length; i++) {
            featuresByDataset[features[i].dataset].push(features[i]);
          }
        } else {
          datasets          = [{ name: '' }];
          featuresByDataset = { '': features };
        }

        for (i = 0; i < datasets.length; i++) {
          values = getValues(featuresByDataset[datasets[i].name]);

          menu.push($.extend({
            Average : values.avg,
            Min     : values.min,
            Max     : values.max
          }, datasets[i].name ? { title: datasets[i].name } : {}));
        }
      }
    } else {
      if (features.length === 1) {
        menu["expected count"] = features[0].height;
      } else {
        for (i = 0; i < features.length; i++) {
          menu[features[i].dataset] = features[i].height;
        }
      }
    }

    return menu;
  }
 
});


