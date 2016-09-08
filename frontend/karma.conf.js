const webpack = require('webpack');

module.exports = config => {
  config.set({
    autowatch: true,
    browsers: ['PhantomJS'],
    frameworks: ['jasmine', 'sinon'],
    files: [
      { pattern: 'src/testIndex.js' },
      { pattern: 'src/**/*', included: false, served: false, watched: true },
    ],
    preprocessors: {
      'src/testIndex.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots'],
    webpack: {
      plugins: [
        new webpack.IgnorePlugin(/ReactContext/),
        new webpack.DefinePlugin({
          customisation: {
            orgName: JSON.stringify('Rabble Rouser'),
          },
        }),
      ],
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            cacheDirectory: '.babel-cache',
            query: {
              presets: ['es2015', 'react', 'stage-0'],
            },
          },
        ],
      },
      resolve: {
        extensions: ['', '.js', '.jsx'],
      },
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
      watch: true,
      devtool: 'inline-source-map',
    },
    webpackServer: {
      noInfo: true,
    },
  });
};
