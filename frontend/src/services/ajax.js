import $ from 'jquery';

const ajax = options => {
  let modifiedOptions = options;

  if (options.url && process.env.API_HOST) {
    modifiedOptions = { ...options, url: `${process.env.API_HOST}${options.url}` };
  }

  return $.ajax(modifiedOptions);
};

export default ajax;
