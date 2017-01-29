import Q from 'q';
import { urls } from './strings';
import { get, post } from './ajax';

export const getBranches = () => Q(get(urls.branchList));
export const register = data => Q(post(urls.register, data));
