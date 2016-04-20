const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));


global.expect = expect;
global.sinon = require('sinon');
global.chai = chai;

