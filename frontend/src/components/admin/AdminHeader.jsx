import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { branchSelected, logout } from '../../actions/';

const BranchDescription = ({ selectedBranch, onSelectBranch, branches }) => {
  const selectBranch = event => onSelectBranch(event.target.value);
  return (
    <span>
      {branches && branches.length > 1 && onSelectBranch ?
        <select id="branches" value={selectedBranch.id} onChange={selectBranch}>
          {branches.map(({ id, name }) =>
            <option key={id} value={id}>{name}</option>
          )}
        </select> :
        selectedBranch.name}
    </span>
  );
};

BranchDescription.propTypes = {
  branches: React.PropTypes.array,
  selectedBranch: React.PropTypes.object,
  onSelectBranch: React.PropTypes.func.isRequired,
};

const AdminHeader = ({ branches, selectedBranch, organisationName, onSelectBranch, onLogout }) => (
  <header className="admin-header header">
    <span><img src="/images/logo/logo_header.svg" alt={organisationName} /></span>
    <BranchDescription selectedBranch={selectedBranch} onSelectBranch={onSelectBranch} branches={branches} />
    <button onClick={onLogout} className="logout">Logout</button>
  </header>
);

AdminHeader.propTypes = {
  branches: React.PropTypes.array,
  organisationName: React.PropTypes.string,
  selectedBranch: React.PropTypes.object,
  onSelectBranch: React.PropTypes.func.isRequired,
  onLogout: React.PropTypes.func.isRequired,
};

const mapStateToProps = ({
  branches,
  organisationName = 'RabbleRouser',
}) => ({
  branches: _.sortBy(branches.availableBranches, 'name'),
  selectedBranch: branches.selectedBranch,
  organisationName,
});

const mapDispatchToProps = dispatch => ({
  onSelectBranch: branchId => dispatch(branchSelected(branchId)),
  onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminHeader);
