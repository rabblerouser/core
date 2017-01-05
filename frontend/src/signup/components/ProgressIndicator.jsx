import React from 'react';
import { connect } from 'react-redux';

import { getProgress } from '../reducers';

const progressClass = (itemStep, currentStep) => {
  if (itemStep < currentStep) {
    return 'visited';
  } else if (itemStep === currentStep) {
    return 'active';
  }
  return 'unvisited';
};

export const ProgressIndicator = ({ progress }) => (
  <ul className="progress-bar">
    {[
      { name: 'details', label: 'Details' },
      { name: 'finished', label: 'Finish' },
    ].map(({ name, label }, i) =>
      (<li className={progressClass(i + 1, progress)} key={name} id={`progress-${name}`}>{label}</li>),
    )}
  </ul>
);

ProgressIndicator.propTypes = {
  progress: React.PropTypes.number.isRequired,
};

export default connect(state => ({ progress: getProgress(state) }))(ProgressIndicator);
