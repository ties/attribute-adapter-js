const webpack = require('webpack');
const config = require('./webpack.config');

module.exports = {
    entry: config.entry,
    module: config.module,
    plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
              warnings: false,
          },
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
        new webpack.NoErrorsPlugin(),
    ],
    output: {
        path: './dist/',
        filename: 'attribute-adapter.min.js',
        libraryTarget: 'var',
        library: 'AttributeAdapter',
    },
    externals: config.externals,
    resolve: config.resolve,
};
