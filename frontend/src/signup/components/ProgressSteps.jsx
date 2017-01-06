import React from 'react';
import { connect } from 'react-redux';

import { getProgress } from '../reducers';
import DetailsForm from './DetailsForm';
import Finished from './Finished';

const steps = [
  null,
  <DetailsForm />,
  <Finished />,
];

export const ProgressSteps = ({ currentStep }) => steps[currentStep];

export default connect(state => ({ currentStep: getProgress(state) }))(ProgressSteps);
