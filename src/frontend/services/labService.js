'use strict';
import Q from 'q';
import $ from 'jquery';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';

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

const getLabGroups = function (lab) {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}/${lab}/groups`,
        dataType: 'json',
    }))
    .then(groupAdapter.parseGroups)
    .catch(handleResponseError);
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
