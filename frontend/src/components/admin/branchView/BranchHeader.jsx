import React from 'react';
import EditBranchModalLauncher from './EditBranchModalLauncher.jsx';
import AddBranchModalLauncher from './AddBranchModalLauncher.jsx';
import DeleteButton from '../../common/DeleteButton.jsx';

const BranchHeader = ({ onSave, onDelete, branch }) => (
  <span className="actions">
    <AddBranchModalLauncher onSave={onSave} />
    <EditBranchModalLauncher onSave={onSave} branch={branch} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current branch?"
      title="Delete branch"
      onDelete={() => onDelete(branch)}
    />
  </span>
);

BranchHeader.propTypes = {
  branch: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default BranchHeader;
