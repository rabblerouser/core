import $ from 'jquery';
import ajax from '../../../services/ajax';

describe('ajax', () => {
  it('passes args through', () => {
    spyOn($, 'ajax').and.returnValue('ajax value');

    const options = { arg1: 'some value', amount: 7 };
    expect(ajax(options)).toEqual('ajax value');

    expect($.ajax).toHaveBeenCalledWith(options);
  });
});
