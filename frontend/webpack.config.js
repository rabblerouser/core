const webpack = require('webpack');

module.exports = {
  entry: {
    main: `${__dirname}/src/components/App.jsx`,
    admin: `${__dirname}/src/components/admin/AdminDashboard.jsx`,
    networkAdmin: `${__dirname}/src/components/admin/NetworkAdminDashboard.jsx`,
  },
  output: {
    path: `${__dirname}/../backend/public/javascript`,
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
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
  plugins: process.env.NODE_ENV ? [new webpack.optimize.UglifyJsPlugin({ minimize: true })] : [],
};
