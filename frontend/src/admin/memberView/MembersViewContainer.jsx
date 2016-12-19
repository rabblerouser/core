import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import EditMemberForm from './EditMemberForm';
import { getGroups, getSelectedGroupId } from '../groupView';
import { Modal } from '../common';

import FilteredMembersList from './FilteredMembersList';
import memberService from '../services/memberService.js';

import { memberListUpdated, finishEditMember, memberListRequested } from './actions';
import { getMembers, getIsEditActive } from './reducers';
import { getSelectedBranchId } from '../reducers/branchReducers';

import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/';

export class MembersViewContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteMember = this.deleteMember.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.updateIfGroupRemoved(this.props.groups, nextProps.groups);
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      this.props.membersRequested();
    }
  }

  deleteMember(member) {
    this.props.onActivityStart();
    return memberService.deleteMember(member.id, this.props.branchId)
      .then(() => {
        this.props.membersUpdated(_.without(this.props.members, member));
        this.props.onActivitySuccess('Member successfully deleted');
      })
      .catch(this.props.onActivityFailure);
  }

  update(collection, element) {
    const newElements = collection.slice(0);
    const oldElement = newElements.find(g => g.id === element.id);
    if (oldElement) {
      Object.assign(oldElement, element);
    } else {
      newElements.push(element);
    }
    this.props.membersUpdated(newElements);
  }

  updateIfGroupRemoved(oldGroups, newGroups) {
    if (!oldGroups || !newGroups || newGroups.length >= oldGroups.length) {
      return;
    }
    const removedGroup = _.difference(oldGroups, newGroups)[0];

    const updatedMembers = this.props.members.map(member =>
      Object.assign(
        {},
        member,
        { groups: _.reject(member.groups, group => group === removedGroup.id) })
    );
    this.props.membersUpdated(updatedMembers);
  }

  render() {
    return (
      <section className="admin-section" id="member-list">
        <a href={`/branches/${this.props.branchId}/members.csv`}>Export all members...</a>
        <FilteredMembersList
          groupFilter={this.props.selectedGroupId}
          groups={this.props.groups}
          members={this.props.members}
          onDeleteMember={this.deleteMember}
        />
        <Modal isOpen={this.props.isModalOpen} handleClose={this.props.handleCloseModal} >
          <EditMemberForm
            onSuccess={this.closeEditForm}
          />
        </Modal>
      {this.props.members.length === 0 && <aside className="no-entries">No entries found</aside>}
      </section>
    );
  }
}

MembersViewContainer.propTypes = {
  selectedGroupId: React.PropTypes.string,
  isModalOpen: React.PropTypes.bool,
  handleCloseModal: React.PropTypes.func,
  groups: React.PropTypes.array,
  members: React.PropTypes.array,
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
  membersUpdated: React.PropTypes.func,
  membersRequested: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onActivityStart: clearMessages,
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
  membersUpdated: members => dispatch(memberListUpdated(members)),
  membersRequested: () => dispatch(memberListRequested()),
  handleCloseModal: finishEditMember,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  groups: getGroups(state),
  members: getMembers(state),
  selectedGroupId: getSelectedGroupId(state),
  isModalOpen: getIsEditActive(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembersViewContainer);
