import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getGroups, getSelectedGroupId } from '../groupView';

import FilteredMembersList from './FilteredMembersList';
import branchService from '../services/branchService.js';
import memberService from '../services/memberService.js';

import {
  getSelectedBranchId,
} from '../reducers/branchReducers';

import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/';

export class MembersViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
    };
    this.saveMember = this.saveMember.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.updateIfGroupRemoved(this.props.groups, nextProps.groups);

    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchMembers(nextProps.branchId)
        .then(members => {
          this.setState({ members });
        });
    }
  }

  saveMember(member) {
    this.props.onActivityStart();
    memberService.update(member, this.props.branchId)
      .then(savedMember => {
        this.update(this.state.members, savedMember);
        this.props.onActivitySuccess('Member saved');
      })
      .catch(this.props.onActivityFailure);
  }

  deleteMember(member) {
    this.props.onActivityStart();
    return memberService.deleteMember(member.id, this.props.branchId)
      .then(() => {
        this.setState({ members: _.without(this.state.members, member) });
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
    this.setState({ members: newElements });
  }

  updateIfGroupRemoved(oldGroups, newGroups) {
    if (!oldGroups || !newGroups || newGroups.length >= oldGroups.length) {
      return;
    }
    const removedGroup = _.difference(oldGroups, newGroups)[0];

    const updatedMembers = this.state.members.map(member =>
      Object.assign(
        {},
        member,
        { groups: _.reject(member.groups, group => group === removedGroup.id) })
    );
    this.setState({ members: updatedMembers });
  }

  render() {
    return (
      <section className="admin-section" id="member-list">
        <a href={`/branches/${this.props.branchId}/members.csv`}>Export all members...</a>
        <FilteredMembersList
          groupFilter={this.props.selectedGroupId}
          groups={this.props.groups}
          members={this.state.members}
          onSaveMember={this.saveMember}
          onDeleteMember={this.deleteMember}
        />
      {this.state.members.length === 0 && <aside className="no-entries">No entries found</aside>}
      </section>
    );
  }
}

MembersViewContainer.propTypes = {
  selectedGroupId: React.PropTypes.string,
  groups: React.PropTypes.array,
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  groups: getGroups(state),
  selectedGroupId: getSelectedGroupId(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembersViewContainer);
