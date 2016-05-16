import $ from 'jquery';
import ajax from '../../../services/ajax';

describe('ajax', () => {
  beforeEach(() => {
    process.env.API_HOST = undefined;
  });

  it('passes args through', () => {
    spyOn($, 'ajax').and.returnValue('ajax value');

    const options = { arg1: 'some value', amount: 7 };
    expect(ajax(options)).toEqual('ajax value');

    expect($.ajax).toHaveBeenCalledWith(options);
  });

  it('prefixes urls with a custom host', () => {
    spyOn($, 'ajax');

    process.env.API_HOST = 'someHost:1234';

    ajax({ url: '/myRoute', otherOption: 'otherValue' });

    expect($.ajax).toHaveBeenCalledWith({ url: 'someHost:1234/myRoute', otherOption: 'otherValue' });
  });

  it('leaves the url alone if no custom API host is set', () => {
    spyOn($, 'ajax');

    const options = { url: '/myRoute', otherOption: 'otherValue' };
    ajax(options);

    expect($.ajax).toHaveBeenCalledWith(options);
  });
});
