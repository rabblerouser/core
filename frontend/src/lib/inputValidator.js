// /////////////////////////////////////// //
// ATTENTION!                              //
// THIS FILE WAS COPIED FROM THE BACKEND!  //
// IT SHOULD BE EXTRACTED/SHARED SOMEHOW!  //
// DO NOT MODIFY IT HERE WITHOUT MODIFYING //
// THE BACKEND COPY AS WELL!!!             //
// /////////////////////////////////////// //

import validator from 'validator';
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

const isValidEmail = email => validator.isEmail(`${email}`);

const isValidOptionalPhoneNumber = input => isEmpty(input) || /^[-+\s()\d]+$/.test(input);

const isValidPhoneNumber = input => /^[-+\s()\d]+$/.test(input);

const isValidPhone = phone => (!!phone) && isValidPhoneNumber(phone);

const isValidPassword = input => (!!input) && /^(.){11,200}$/.test(input);

const isValidUUID = input => validator.isUUID(`${input}`, 4);

module.exports = {
  isValidString,
  isValidName,
  isValidOptionalName,
  isValidEmail,
  isValidPhone,
  isValidOptionalPhoneNumber,
  isValidText,
  isValidOptionalTextBlock,
  isValidTextBlock,
  isValidUUID,
  isValidPassword,
};
