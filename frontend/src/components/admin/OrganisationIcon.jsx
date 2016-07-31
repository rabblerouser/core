import React from 'react';
import { connect } from 'react-redux';

const OrganisationIcon = ({ alt, src }) => <span><img src={src} alt={alt} /></span>;

OrganisationIcon.propTypes = {
  alt: React.PropTypes.string,
  src: React.PropTypes.string,
};

const mapStateToProps = () => ({
  alt: 'RabbleRouser',
  src: '/images/logo/logo_header.svg',
});

export default connect(mapStateToProps)(OrganisationIcon);
