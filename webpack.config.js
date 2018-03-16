var webpack = require('webpack');

module.exports = {
  entry   : __dirname + '/list-js.js',
  output  : { filename: 'public/javascript/genoverse.min.js'},
  plugins : [
    new webpack.ProvidePlugin({
      $      : __dirname + '/public/javascript/lib/jquery.js',
      jQuery : __dirname + '/public/javascript/lib/jquery.js'
    }),
    new webpack.DefinePlugin({
      define: undefined // Stop jquery-ui.js trying to do define(["jquery"]), which doesn't work if jquery isn't in node_modules
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    })
  ]
};
