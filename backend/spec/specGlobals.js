const chai = require('chai');
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

chai.should();
global.expect = chai.expect;
global.sinon = require('sinon');

global.chai = chai;

require('sinon-as-promised');
