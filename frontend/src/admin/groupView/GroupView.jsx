import React, { Component } from 'react';
import { connect } from 'react-redux';

import GroupSelect from './GroupSelect';
import GroupDetails from './GroupDetails';
import GroupModal from './GroupModal';
import { AddButton } from '../common';
import { getSelectedBranchId } from '../reducers/branchReducers';
import { createGroup, groupListRequested } from './actions';

export class GroupView extends Component {

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.requestGroupList();
    }
  }
  render() {
    return (
      <section className="admin-section" id="group-details">
        <h3>
          Groups
          <AddButton onClick={this.props.create} />
        </h3>
        <GroupSelect />
        <GroupDetails />
        <GroupModal />
      </section>
  );
  }
}

GroupView.propTypes = {
  create: React.PropTypes.func,
  requestGroupList: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

const mapDispatchToProps = { create: createGroup, requestGroupList: groupListRequested };
export default connect(mapStateToProps, mapDispatchToProps)(GroupView);
