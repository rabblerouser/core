export const LOGOUT = 'LOGOUT';

export const logout = () => {
  window.location.href = '/logout';
  return (
  {
    type: LOGOUT,
  }
  );
};
