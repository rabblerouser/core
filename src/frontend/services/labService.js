'use strict';

const Q = require('q');
const $ = require('jquery');
import { Resources } from '../config/strings';

const handleResponseError = function(error) {
  switch(error.status) {
    case 404 : throw new Error('LABS NOT FOUND');
    default: throw new Error('LABS NOT AVAILABLE');
  }
};

const getLabList = function () {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}`,
        dataType: 'json',
    }))
    .catch(handleResponseError)
    .then((data) => {
        if(data.branches) {
          return data.branches;
        }
        throw new Error('INVALID LAB LIST');
    });
};

export default {
    getLabList: getLabList
};
