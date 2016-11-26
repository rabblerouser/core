import React from 'react';
import { connect } from 'react-redux';

import { createGroup } from './actions';

const CreateGroupButton = ({ create }) => (
  <button onClick={create} className="new" title="New group">
    <span>New group</span>
  </button>
);

CreateGroupButton.propTypes = {
  create: React.PropTypes.func,
};

export default connect(() => ({}), { create: createGroup })(CreateGroupButton);
