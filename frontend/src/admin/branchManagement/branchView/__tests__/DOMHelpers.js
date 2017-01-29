export const $ = selector => global.document.querySelector(selector);

export const trigger = (el, ev) => {
  const e = global.document.createEvent('UIEvents');
  e.initEvent(ev, true, true);
  el.dispatchEvent(e);
};

export const changeInputValue = (name, value) => {
  $(`input[name="${name}"]`).value = value;
  trigger($(`input[name="${name}"]`), 'blur');
};

export const changeTextAreaValue = (name, value) => {
  $(`textArea[name="${name}"]`).value = value;
  trigger($(`textArea[name="${name}"]`), 'blur');
};

export const clickSubmit = () =>
  trigger($('button[type="submit"]'), 'click');
