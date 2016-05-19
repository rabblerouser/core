import 'babel-polyfill';
require('core-js/es5');

const context = require.context('./__tests__', true, /-test\.jsx?$/);

context.keys().forEach(context);
