import React from 'react';
import adminService from '../../services/adminService.js';
import _ from 'underscore';

const AdminHeader = props => {
  const mapBranchOptions = () => (
    _.sortBy(props.branches, 'name').map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)
  );

  const selectBranch = event => {
    props.onSelectBranch(event.target.value);
  };

  const branchDescription = props.onSelectBranch ?
    <select id="branches" value={props.selectedBranch.id} onChange={selectBranch}>{mapBranchOptions()}</select> :
    <span className="currentBranch">{props.selectedBranch.name}</span>;

  const logout = () => {
    adminService.logout();
  };

  return (
    <header className="admin-header header">
      <span><img src="/images/logo/logo_header.svg" alt="The Lab" /></span>
      {branchDescription}
      <button onClick={logout} className="logout">Logout</button>
    </header>
  );
};

AdminHeader.propTypes = {
  branches: React.PropTypes.array,
  selectedBranch: React.PropTypes.object,
  onSelectBranch: React.PropTypes.func.isRequired,
};

export default AdminHeader;
