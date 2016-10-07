import React from 'react';
import { connect } from 'react-redux';

import Logo from './Logo';
import ProgressIndicator from './ProgressIndicator';
import ProgressSteps from './ProgressSteps';
import PageError from './PageError';
import { getPageError } from '../reducers';

export const SignupPage = ({ pageError }) => (
  <main>
    <div id="form" className="form-container">
      <div className="header">
        <Logo />
        <ProgressIndicator />
      </div>
      {pageError && <PageError pageError={pageError} />}
      <ProgressSteps />
    </div>
  </main>
);

SignupPage.propTypes = {
  pageError: React.PropTypes.string,
};

export default connect(state => ({ pageError: getPageError(state) }))(SignupPage);
