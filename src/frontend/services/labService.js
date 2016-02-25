'use strict';

const Q = require('q');
const $ = require('jquery');
import { Resources } from '../config/strings';

const getLabList = function () {

  var deferred = Q.defer();
  $.get( `${Resources.labHost}/${Resources.labListEndPoint}`, function(data) {
    data.branches ? deferred.resolve(data.branches) : deferred.reject();
  })
  .fail( () => {
    deferred.reject();
  });

  return deferred.promise;
};

export default {
    getLabList: getLabList
};
