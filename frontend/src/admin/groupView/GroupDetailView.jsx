import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGroup } from './reducers';
import GroupHeader from './GroupHeader';
import GroupDetails from './GroupDetails';

const GroupDetailView = ({ selectedGroup, onSave, onDelete }) => (
  selectedGroup ?
    <section className="admin-section" id="description">
      <GroupDetails group={selectedGroup} />
      <GroupHeader onSave={onSave} onDelete={onDelete} group={selectedGroup} />
    </section> : null
);

GroupDetailView.propTypes = {
  selectedGroup: React.PropTypes.object,
  onSave: React.PropTypes.func,
  onDelete: React.PropTypes.func,
};

const mapStateToProps = state => ({
  selectedGroup: getSelectedGroup(state),
});

export default connect(mapStateToProps)(GroupDetailView);
