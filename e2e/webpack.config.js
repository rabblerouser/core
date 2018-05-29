// e2e/webpack.config.js
// Webpack configuration for end-to-end test suite.
// Documentation: <URL:https://webpack.js.org/configuration/>.

module.exports = {

  // The point or points to enter the application and start execution.
  entry: `${__dirname}/spec/index.js`,

  // Where to generate output files.
  output: {
    // The output directory path.
    path: './tmp/',

    // The base filename of the generated bundle.
    filename: 'test-bundle.js',
  },

  // Specifications for treatment of different modules in the project.
  module: {

    // Normal loaders to use, by module type.
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },

  // Specify whether and how to generate source maps.
  devtool: 'source-map',

};
