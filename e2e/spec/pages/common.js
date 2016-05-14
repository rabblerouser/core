const casper = window.casper;

function indexOfOption(select, option) {
  for (let i = 0; i < select.length; i++) {
    if (select[i].childNodes[0].nodeValue === option) {
      return i;
    }
  }
  return -1;
}

export function navigateTo(url) {
  const baseUrl = casper.cli.get('url');
  return casper.start(baseUrl + url)
  .then(() => casper.waitForSelector('body'));
}

export function inputById(id, text) {
  return casper.sendKeys(`#${id}`, text);
}

export function buttonPressById(id) {
  return casper.click(`input[id=${id}]`);
}

export function buttonPressByText(text) {
  return casper.clickLabel(text, 'button');
}

export function buttonPressBySelector(selector) {
  casper.click(selector);
}

export function pageTitle() {
  return casper.getTitle();
}

export function selectOptionById(id, option) {
  return casper.thenEvaluate((evalId, evelOption, evalIndexOfOption) => {
    const select = document.querySelector(`select[id=${evalId}]`);
    if (select === null) {
      return;
    }
    select.selectedIndex = evalIndexOfOption(select, evelOption);
    // Event needs to be fired for React to recognise the change
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    select.dispatchEvent(event);
  }, id, option, indexOfOption);
}

export function innerTextByClass(className) {
  return casper.evaluate(evalClassName => {
    const field = document.querySelector(`.${evalClassName}`);
    return field === null ? null : field.innerText;
  }, className);
}

export function innerTextBySelector(selector) {
  return casper.evaluate(evalselector => {
    const field = document.querySelector(`${evalselector}`);
    return field === null ? null : field.innerText;
  }, selector);
}

export function waitForInnerText(selector, text) {
  return casper.then(() =>
    casper.waitFor(() => {
      const result = innerTextBySelector(selector);
      return result.indexOf(text) > -1;
    })
  );
}
