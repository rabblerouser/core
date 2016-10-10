const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassPaths = require('node-neat').includePaths.map(sassPath => `includePaths[]=${sassPath}`).join('&');

module.exports = {
  entry: {
    signupApp: ['babel-polyfill', `${__dirname}/src/signup/SignupApp.jsx`],
    adminApp: ['babel-polyfill', `${__dirname}/src/admin/AdminApp.jsx`],
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
        loader: ExtractTextPlugin.extract('style-loader', `css?sourceMap!sass?sourceMap&${sassPaths}`),
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
    new webpack.DefinePlugin({
      customisation: {
        signupTitle: JSON.stringify(process.env.SIGNUP_TITLE || 'Register for Rabble Rouser'),
        signupSubtitle: JSON.stringify(process.env.SIGNUP_SUBTITLE || 'Join our movement today!'),
        signupFinishedMessage: JSON.stringify(process.env.SIGNUP_FINISHED_MESSAGE || 'Thanks for joining!'),
        signupStylesheets: process.env.SIGNUP_STYLESHEETS || JSON.stringify([
          '/signup.css',
          'https://fonts.googleapis.com/css?family=Droid+Serif|Open+Sans',
        ]),
        signupHomepageLink: JSON.stringify(process.env.SIGNUP_HOMEPAGE_LINK || 'https://rabblerouser.team'),
        skin: JSON.stringify(process.env.SKIN || 'default_skin'),
      },
    }),
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
            // Handle requests for static assets
            if (req.url === '/error') return '/error.html';
            if (req.url === '/login') return '/login.html';
            if (req.url === '/') return '/signup.html';
            if (req.url === '/signup.css') return '/signup.css';
            if (req.url.startsWith('/dashboard')) return '/admin.html';
            if (req.url.startsWith('/images')) return req.url;

            // Handle requests for hot module reloading
            const hotUpdateRequest = req.url.match(/^.*(\/javascript\w*\.hot-update\.json)$/);
            if (hotUpdateRequest) return hotUpdateRequest[1];
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
