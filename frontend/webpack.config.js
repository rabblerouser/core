const webpack = require('webpack');

module.exports = {
  entry: {
    main: ['babel-polyfill', `${__dirname}/src/components/App.jsx`],
    admin: ['babel-polyfill', `${__dirname}/src/components/admin/AdminDashboard.jsx`],
    networkAdmin: ['babel-polyfill', `${__dirname}/src/components/admin/NetworkAdminDashboard.jsx`],
  },
  output: {
    path: `${__dirname}/public/javascript`,
    publicPath: 'javascript',
    filename: '[name].bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    'hide-modules': true,
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
        bypass: req => {
          if (req.method === 'GET') {
            if (['/admin', '/dashboard', '/error', '/index', '/login'].indexOf(req.url) > -1) {
              return `${req.url}.html`;
            }
            if (req.url === '/dashboard/admin') {
              return '/admin.html';
            }
            if (req.url === '/' || req.url.startsWith('/stylesheets') || req.url.startsWith('/images')) {
              return req.url;
            }
          }
          return false;
        },
      },
    },
  },
  node: { fs: 'empty' },
};
