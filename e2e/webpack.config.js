module.exports = {
  entry: `${__dirname}/spec/index.js`,
  output: {
    path: './e2e-tmp/',
    filename: 'test-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0'],
        },
      },
    ],
  },
  devtool: 'source-map',
};
