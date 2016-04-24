require('core-js/es5');
const context = require.context('.', true, /-test\.jsx?$/);

context.keys().forEach(context);
