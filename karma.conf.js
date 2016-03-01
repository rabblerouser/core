var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['jasmine', 'sinon'],
        files: [
            { pattern: 'webpack.test.config.js', watched: false }
        ],
        preprocessors: {
            'webpack.test.config.js': ['webpack', 'sourcemap']
        },
        reporters: ['dots'],
        webpack: {
            plugins: [
                  new webpack.IgnorePlugin(/ReactContext/),
              ],
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        cacheDirectory: '.babel-cache',
                        query: {
                            presets: ['es2015', 'react', 'stage-0']
                        }
                    }
                ]
            },
            watch: true,
            devtool: 'inline-source-map'
        },
        webpackServer: {
            noInfo: true
        }
    });
};
