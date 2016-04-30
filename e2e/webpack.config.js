module.exports = {
  entry: `${__dirname}/spec/index.js`,
  output: {
    path: './tmp/',
    filename: 'test-bundle.js',
  },
  module: {
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
  devtool: 'source-map',
};
