// const casper = window.casper;
//
// function indexOfOption(select, option) {
//   for (let i = 0; i < select.length; i++) {
//     if (!!select[i] && select[i].innerText === option) {
//       return i;
//     }
//   }
//   return -1;
// }
//
// function mapTextFromSelector(selector) {
//   const result = document.querySelector(selector);
//   return !!result ? Array.map(result.children, e => e.innerText) : [];
// }

export function navigateTo(url) {
  cy.visit(url);
}

export function inputById(id, text) {
  return cy.get(`#${id}`).type(text);
}

// export function buttonPressByText(text) {
//   return casper.clickLabel(text, 'button');
// }

export function elementClickByText(text, selector) {
  cy.contains(text).click();
}


export function buttonPressBySelector(id) {
  cy.get(`#${id}`).click()
}

export function buttonPressByDataAttribute(text) {
  cy.get(`[data-cy=${text}]`).click()
}

export function pageTitle() {
  return cy.title();
}
//
// export function selectOptionById(id, option) {
//   return casper.thenEvaluate((evalId, evalOption, evalIndexOfOption) => {
//     const select = document.querySelector(`select[id=${evalId}]`);
//     if (!select) {
//       return;
//     }
//     select.selectedIndex = evalIndexOfOption(select, evalOption);
//     // Event needs to be fired for React to recognise the change
//     const event = document.createEvent('HTMLEvents');
//     event.initEvent('change', true, true);
//     select.dispatchEvent(event);
//   }, id, option, indexOfOption);
// }
//
// export function innerTextByClass(className) {
//   return casper.evaluate(evalClassName => {
//     const field = document.querySelector(`.${evalClassName}`);
//     return field === null ? null : field.innerText;
//   }, className);
// }
//
// export function innerTextBySelector(selector) {
//   return casper.evaluate(evalselector => {
//     const field = document.querySelector(`${evalselector}`);
//     return field === null ? null : field.innerText;
//   }, selector);
// }
//
// export function itemBySelector(selector) {
//   return casper.evaluate(evalselector => {
//     const field = document.querySelector(`${evalselector}`);
//     return field === null ? null : field;
//   }, selector);
// }
//
// export function waitForInnerText(selector, text) {
//   return casper.waitFor(() => {
//     const result = innerTextBySelector(selector);
//     return result.indexOf(text) > -1;
//   });
// }
//
// export function waitForOptionInSelectById(selectId, option) {
//   return casper.waitFor(() => {
//     const options = casper.evaluate(
//       (selector, mapper) => mapper(selector), `select[id=${selectId}]`, mapTextFromSelector);
//     return options.indexOf(option) > -1;
//   });
// }
