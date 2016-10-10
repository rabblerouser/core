import React from 'react';

const FormHeader = ({ orgName = customisation.orgName }) => (
  <header>
    <h1 className="form-title">Register for {orgName}</h1>
  </header>
);
FormHeader.propTypes = {
  orgName: React.PropTypes.string,
};
export default FormHeader;
