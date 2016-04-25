module.exports = {
  entry: `${__dirname}/../backend/spec/acceptance/index.js`,
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
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
    ],
  },
  devtool: 'source-map',
};
