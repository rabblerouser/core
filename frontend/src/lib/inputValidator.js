// /////////////////////////////////////// //
// ATTENTION!                              //
// THIS FILE WAS COPIED FROM THE BACKEND!  //
// IT SHOULD BE EXTRACTED/SHARED SOMEHOW!  //
// DO NOT MODIFY IT HERE WITHOUT MODIFYING //
// THE BACKEND COPY AS WELL!!!             //
// /////////////////////////////////////// //

import validator from 'validator';
import moment from 'moment';
import { isEmpty } from 'lodash';

const containsSpecialCharacters = (theString, restricted) => restricted.test(theString);

const isValidString = (theString, restricted) => (
  !!theString && !containsSpecialCharacters(theString, restricted || new RegExp('[<>"%;()&+]'))
);

const isValidOptionalName = name => isEmpty(name) || (isValidString(name) && name.length < 256);

const isValidName = name => isValidString(name) && name.length < 256;

const isValidText = text => !!text && text.length < 256;

const isValidOptionalTextBlock = block => isEmpty(block) || block.length < 100000;

const isValidTextBlock = block => !!block && block.length < 100000;

const isValidEmail = email => validator.isEmail(email);

const isValidOptionalPhoneNumber = input => isEmpty(input) || /^[-+\s()\d]+$/.test(input);

const isValidPhoneNumber = input => /^[-+\s()\d]+$/.test(input);

const isValidPhone = phone => (!!phone) && isValidPhoneNumber(phone);

const isValidDate = date => {
  const formattedDate = moment(date, 'DD/MM/YYYY', true);
  return formattedDate.isValid() && formattedDate.isSameOrBefore(moment());
};

const isValidYear = number => {
  const currentYear = new Date().getFullYear();
  const year = parseInt(number, 10);
  return year <= currentYear && year >= 1900;
};

const isValidPassword = input => (!!input) && /^(.){11,200}$/.test(input);

const isValidUUID = input => validator.isUUID(input, 4);

module.exports = {
  isValidString,
  isValidName,
  isValidOptionalName,
  isValidEmail,
  isValidPhone,
  isValidOptionalPhoneNumber,
  isValidDate,
  isValidText,
  isValidOptionalTextBlock,
  isValidTextBlock,
  isValidUUID,
  isValidYear,
  isValidPassword,
};
