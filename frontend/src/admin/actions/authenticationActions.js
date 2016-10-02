export const LOGOUT = 'LOGOUT';
import adminService from '../services/adminService.js';

export const logout = () => (
  {
    type: LOGOUT,
    placeholder: adminService.logout(),
  }
);
