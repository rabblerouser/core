import React from 'react';

const Logo = ({ skin = customisation.skin }) => (
  <img src={`/images/${skin}/logo_signup_page.png`} alt="Sign Up" />
);

Logo.propTypes = {
  skin: React.PropTypes.string,
};

export default Logo;
