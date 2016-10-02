import $ from 'jquery';

const ajax = options => (
  $.ajax(options)
);

export const post = (url, data, dataType = 'json') => (
  $.post(url, data, null, dataType)
);

export const get = (url, data = {}, dataType = 'json') => (
  $.get(url, data, null, dataType)
);

export default ajax;
