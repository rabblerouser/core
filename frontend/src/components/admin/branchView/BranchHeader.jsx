import React from 'react';
import EditBranchModalLauncher from './EditBranchModalLauncher.jsx';
import AddBranchModalLauncher from './AddBranchModalLauncher.jsx';
import DeleteBranchButton from './DeleteBranchButton.jsx';

const BranchHeader = ({ onSave, onDelete, branch }) => (
  <span className="actions">
    <AddBranchModalLauncher onSave={onSave} />
    <EditBranchModalLauncher onSave={onSave} branch={branch} />
    <DeleteBranchButton onDelete={onDelete} branch={branch} />
  </span>
);

BranchHeader.propTypes = {
  branch: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

export default BranchHeader;
