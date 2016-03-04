'use strict';

const Q = require('q');
const $ = require('jquery');
import { Resources } from '../config/strings';

const handleResponseError = function(error) {
  switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

const getMyLabs = function () {
    return Q($.ajax({
          type: 'GET',
          url: `/${Resources.myLabListEndPoint}`,
          dataType: 'json',
      }))
      .catch(handleResponseError)
      .then((data) => {
          if(data.branches) {
            return data.branches;
          }
          throw new Error('INVALID LAB LIST');
      });
}

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

const getLabGroups = function (lab) {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}/${lab}/groups`,
        dataType: 'json',
    }))
    .catch(handleResponseError)
    .then((data) => {
        if(data.groups) {
          return data.groups;
        }
        throw new Error('INVALID GROUP LIST');
    });
};

const getLabPartipicants = function (lab) {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}/${lab}/members`,
        dataType: 'json',
    }))
    .catch(handleResponseError)
    .then((data) => {
        if(data.members) {
          return data.members;
        }
        throw new Error('INVALID PARTICIPANT LIST');
    });
};

export default {
    getLabList: getLabList,
    getMyLabs: getMyLabs,
    getLabGroups: getLabGroups,
    getLabPartipicants: getLabPartipicants
};
