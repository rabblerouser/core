import React from 'react';
import { connect } from 'react-redux';

import { DeleteButton, EditButton } from '../../common';
import { editGroup, groupRemoveRequested } from './actions';

export const GroupActions = ({ remove, edit }) => (
  <span className="actions">
    <EditButton onClick={edit} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current group?"
      title="Delete group"
      onDelete={remove}
    />
  </span>
);

GroupActions.propTypes = {
  remove: React.PropTypes.func,
  edit: React.PropTypes.func,
};

export default connect(() => ({}), { edit: editGroup, remove: groupRemoveRequested })(GroupActions);
