const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const neat = require('node-neat').includePaths;

module.exports = {
  entry: {
    main: ['babel-polyfill', `${__dirname}/src/components/App.jsx`],
    admin: ['babel-polyfill', `${__dirname}/src/components/Admin.jsx`],
    networkAdmin: ['babel-polyfill', `${__dirname}/src/components/NetworkAdmin.jsx`],
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
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', `css?sourceMap!sass?sourceMap&includePaths[]=${neat}`),
      },
      {
        test: /\.svg/,
        loader: 'svg-url-loader',
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
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    'hide-modules': true,
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
        bypass: req => {
          if (req.method === 'GET') {
            if (['/dashboard', '/error', '/index', '/login'].indexOf(req.url) > -1) {
              // Let WDS serve these routes, returning the corresponding html file contents
              return `${req.url}.html`;
            }
            if (req.url === '/dashboard/admin') {
              // Same as above but the admin route is tricky
              return '/admin.html';
            }
            const hotUpdateRequest = req.url.match(/^.*(\/javascript\w*\.hot-update\.json)$/);
            if (hotUpdateRequest) {
              // Pass HMR requests to the WDS, fixing up relative URL stuff.
              return hotUpdateRequest[1];
            }
            if (req.url === '/' || req.url.startsWith('/images')) {
              // Let WDS serve '/' as 'index.html', and all images as static content
              // Also, it will automatically do this for /javascript, because of the publicPath config
              return req.url;
            }
          }
          // Let all other requests proxy through to the target mentioned above
          return false;
        },
      },
    },
  },
  node: { fs: 'empty' },
  watchOptions: {
    poll: true,
  },
};
