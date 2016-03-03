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

const getLabGroups = function () {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.groupListEndPoint}`,
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

const getLabPartipicants = function () {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.membersEndPoint}`,
        dataType: 'json',
    }))
    .catch(handleResponseError)
    .then((data) => {
        if(data.members) {
          return data.members;
        }
        throw new Error('INVALID MEMBERS LIST');
    });
};

export default {
    getLabList: getLabList,
    getMyLabs: getMyLabs,
    getLabGroups: getLabGroups,
    getLabPartipicants: getLabPartipicants
};
