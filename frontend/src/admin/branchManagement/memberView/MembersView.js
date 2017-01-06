import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditMemberForm from './EditMemberForm';
import FilteredMembersList from './FilteredMembersList';
import { Modal } from '../../common';
import { finishEditMember, memberListRequested } from './actions';
import { getIsEditActive } from './reducers';
import { getSelectedBranchId } from '../../reducers/branchReducers';

export class MembersView extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      this.props.membersRequested();
    }
  }

  render() {
    return (
      <section className="admin-section" id="member-list">
        <a href={`/branches/${this.props.branchId}/members.csv`}>Export all members...</a>
        <FilteredMembersList />
        <Modal isOpen={this.props.isModalOpen} handleClose={this.props.handleCloseModal} >
          <EditMemberForm onSuccess={this.closeEditForm} />
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  membersRequested: () => dispatch(memberListRequested()),
  handleCloseModal: finishEditMember,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  isModalOpen: getIsEditActive(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembersView);
