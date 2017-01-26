import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditGroupForm from './EditGroupForm';
import GroupSelect from './GroupSelect';
import GroupDetails from './GroupDetails';
import { AddButton, Modal, Panel } from '../../common';
import { getSelectedBranchId } from '../../reducers/branchReducers';
import { createGroup, groupListRequested, finishEditGroup } from './actions';
import { getIsEditActive } from './reducers';

export class GroupView extends Component {

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.requestGroupList();
    }
  }
  render() {
    return (
      <Panel>
        <h3>
          Groups
          <AddButton onClick={this.props.create} />
          <GroupSelect />
        </h3>
        <GroupDetails />
        <Modal isOpen={this.props.isModalOpen} handleClose={this.props.handleCloseModal} >
          <EditGroupForm />
        </Modal>
      </Panel>
    );
  }
}

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  isModalOpen: getIsEditActive(state),
});

const mapDispatchToProps = {
  create: createGroup,
  requestGroupList: groupListRequested,
  handleCloseModal: finishEditGroup,
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupView);
