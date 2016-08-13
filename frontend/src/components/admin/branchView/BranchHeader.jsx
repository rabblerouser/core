import React from 'react';
import EditBranchModalLauncher from './EditBranchModalLauncher';
import AddBranchModalLauncher from './AddBranchModalLauncher';
import DeleteButton from '../../common/DeleteButton';

const BranchHeader = ({ onCreate, onUpdate, onDelete, branch }) => (
  <span className="actions">
    <AddBranchModalLauncher onSave={onCreate} />
    <EditBranchModalLauncher onSave={onUpdate} branch={branch} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current branch?"
      title="Delete branch"
      onDelete={() => onDelete(branch)}
    />
  </span>
);

BranchHeader.propTypes = {
  branch: React.PropTypes.object,
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default BranchHeader;
