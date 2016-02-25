'use strict';

const Q = require('q');

const getLabList = function () {

  var deferred = Q.defer();
  deferred.resolve( [{key: '1', value: 'Geelong'}, {key: '2', value: 'Melbourne'}, {key: '3', value: 'East Melbourne'}] );
  return deferred.promise;
};

export default {
    getLabList: getLabList
};
