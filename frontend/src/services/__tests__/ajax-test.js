import $ from 'jquery';
import ajax, { get, post } from '../ajax';

describe('ajax', () => {
  it('passes args through', () => {
    spyOn($, 'ajax').and.returnValue('ajax value');

    const options = { arg1: 'some value', amount: 7 };
    expect(ajax(options)).toEqual('ajax value');

    expect($.ajax).toHaveBeenCalledWith(options);
  });

  it('passes post args through', () => {
    spyOn($, 'post').and.returnValue('ajax value');
    expect(post('url', 'data', 'dataType')).toEqual('ajax value');

    expect($.post).toHaveBeenCalledWith('url', 'data', null, 'dataType');
  });

  it('passes get args through', () => {
    spyOn($, 'get').and.returnValue('ajax value');
    expect(get('url', 'data', 'dataType')).toEqual('ajax value');

    expect($.get).toHaveBeenCalledWith('url', 'data', null, 'dataType');
  });
});
