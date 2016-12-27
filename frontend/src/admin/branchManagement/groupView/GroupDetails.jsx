import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGroup } from './reducers';
import GroupActions from './GroupActions';

export const GroupDetails = ({ group }) => (
  group ?
    <section className="admin-section" id="description">
      <div>
        <p>
          {group.description}
        </p>
      </div>
      <GroupActions />
    </section> : null
);

GroupDetails.propTypes = {
  group: React.PropTypes.object,
};

const mapStateToProps = state => ({
  group: getSelectedGroup(state),
});

export default connect(mapStateToProps)(GroupDetails);
