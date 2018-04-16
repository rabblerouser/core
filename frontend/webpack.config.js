// frontent/webpack.config.js
// Webpack configuration for front-end application.
// Documentation: <URL:https://webpack.js.org/configuration/>.

const webpack = require('webpack');

module.exports = {

  // The point or points to enter the application and start execution.
  entry: {
    signupApp: ['babel-polyfill', `${__dirname}/src/signup/SignupApp.js`],
    adminApp: ['babel-polyfill', `${__dirname}/src/admin/AdminApp.js`],
  },

  // Where to generate output files.
  output: {
    // The output directory path.
    path: `${__dirname}/public/javascript`,

    // The public URL of the output directory when referenced in a browser.
    publicPath: 'javascript',

    // The base filename of the generated bundle.
    filename: '[name].bundle.js',
  },

  // Specifications for treatment of different modules in the project.
  module: {

    // Pre-loaders to use, by module type.
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],

    // Normal loaders to use, by module type.
    loaders: [
      {
        test: /\.svg/,
        loader: 'svg-url-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
    ],
  },

  // Specifications for locating a module by its path.
  resolve: {
    extensions: ['', '.js'],
  },

  // Webpack plug-ins to enable.
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.DefinePlugin({
      customisation: {
        signupTitle: JSON.stringify(process.env.SIGNUP_TITLE || 'Register for Rabble Rouser'),
        signupSubtitle: JSON.stringify(process.env.SIGNUP_SUBTITLE || 'Join our movement today!'),
        signupFinishedMessage: JSON.stringify(process.env.SIGNUP_FINISHED_MESSAGE || 'Thanks for joining!'),
        signupHomepageLink: JSON.stringify(process.env.SIGNUP_HOMEPAGE_LINK || 'https://rabblerouser.team'),
        signupStylesheets: process.env.SIGNUP_STYLESHEETS || JSON.stringify([
          '/styles/signup.css',
          'https://fonts.googleapis.com/css?family=Droid+Serif|Open+Sans',
        ]),
        addressEnabled: JSON.stringify(process.env.ADDRESS_ENABLED || false),
      },
    }),
  ],

  // Specify whether and how to generate source maps.
  devtool: 'cheap-module-eval-source-map',

  // Options to change the behaviour of the dev server.
  devServer: {

    // Host for the dev server to listen on.
    host: '0.0.0.0',

    // Hide information about modules in CLI output?
    'hide-modules': true,

    // Options for the HTTP proxy middleware.
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
        bypass: req => {
          if (req.method === 'GET') {
            // Handle requests for static assets
            if (req.url === '/error') return '/error.html';
            if (req.url.startsWith('/images')) return req.url;
            if (req.url.startsWith('/styles')) return req.url;

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

  // Configure whether to alter certain Node.js globals and modules.
  node: { fs: 'empty' },

  // Options to customise the behaviour of watch mode.
  watchOptions: {
    poll: true,
  },
};
