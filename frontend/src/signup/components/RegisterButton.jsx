import React from 'react';

const RegisterButton = ({ children }) => (
  <button
    className="save"
    type="submit"
  >
    {children}
  </button>
);
RegisterButton.propTypes = {
  children: React.PropTypes.any,
};
export default RegisterButton;
