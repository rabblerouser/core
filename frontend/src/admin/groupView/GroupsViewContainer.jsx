import React, { Component } from 'react';
import { connect } from 'react-redux';

import GroupsView from './GroupsView';
import MembersViewContainer from '../components/memberView/MembersViewContainer';

import { getSelectedBranchId } from '../reducers/branchReducers';
import { groupListRequested } from './actions';

class GroupsViewContainer extends Component {

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.requestGroupList();
    }
  }

  render() {
    return (
      <section>
        <GroupsView />
        <MembersViewContainer />
      </section>
    );
  }
}

GroupsViewContainer.propTypes = {
  requestGroupList: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, { requestGroupList: groupListRequested })(GroupsViewContainer);
