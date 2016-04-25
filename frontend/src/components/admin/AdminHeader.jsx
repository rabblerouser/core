import React from 'react';
import adminService from '../../services/adminService.js';
import _ from 'underscore';

const AdminHeader = props => {
  const mapLabOptions = () => (
    _.sortBy(props.labs, 'name').map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)
  );

  const selectLab = event => {
    props.onSelectLab(event.target.value);
  };

  const labDescription = props.onSelectLab ?
    <select value={props.selectedLab.id} onChange={selectLab}>{mapLabOptions()}</select> :
    <span className="currentlab">{props.selectedLab.name}</span>;

  const logout = () => {
    adminService.logout();
  };

  return (
    <header className="admin-header header">
      <span><img src="/images/the_lab_logo.svg" alt="The Lab" /></span>
      {labDescription}
      <button onClick={logout} className="logout">Logout</button>
    </header>
  );
};

AdminHeader.propTypes = {
  labs: React.PropTypes.array,
  selectedLab: React.PropTypes.object,
};

export default AdminHeader;
