import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGroup } from './reducers';
import GroupActions from './GroupActions';
import { Panel } from '../../common';

export const GroupDetails = ({ group }) => (
  group ?
    <Panel>
      <p>{group.description}</p>
      <GroupActions />
    </Panel> : null
);

const mapStateToProps = state => ({
  group: getSelectedGroup(state),
});

export default connect(mapStateToProps)(GroupDetails);
