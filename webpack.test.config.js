require('core-js/es5');

var context = require.context('./components', true, /-test\.jsx?$/);
context.keys().forEach(context);
