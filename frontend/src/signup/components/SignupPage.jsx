import React from 'react';
import { connect } from 'react-redux';

import PageHeader from './PageHeader';
import ProgressSteps from './ProgressSteps';
import PageError from './PageError';
import { getPageError } from '../reducers';

export const SignupPage = ({ pageError }) => (
  <div>
    <PageHeader />
    <main>
      {pageError && <PageError pageError={pageError} />}
      <ProgressSteps />
    </main>
    {
      customisation.signupStylesheets.map(stylesheet => (
        <link rel="stylesheet" href={stylesheet} key={stylesheet} />
      ))
    }
  </div>
);

export default connect(state => ({ pageError: getPageError(state) }))(SignupPage);
