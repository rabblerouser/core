import React, { Component } from 'react';
import _ from 'lodash';
import FilteredMembersList from './FilteredMembersList.jsx';
import branchService from '../../../services/branchService.js';
import memberService from '../../../services/memberService.js';

export default class MembersViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      onSave: member => {
        this.props.onPreAction();
        memberService.update(member, this.props.branchId)
          .then(savedMember => {
            this.update(this.state.members, savedMember);
            this.props.onActionSuccess('Member saved');
          })
          .catch(this.props.onActionError);
      },
    };
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

    const updatedMembers = this.state.members.map(member => {
      /* eslint no-param-reassign: "warn"*/
      // TODO: Don't mutate here, and remove eslint config above!
      member.groups = _.reject(member.groups, group => group === removedGroup.id);
      return member;
    });
    this.setState({ members: updatedMembers });
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

  getSelectedGroup() {
    if (this.props.selectedGroupId === 'all' || this.props.selectedGroupId === 'unassigned') {
      return null;
    }
    return this.props.groups.find(group => group.id === this.props.selectedGroupId);
  }

  render() {
    return (
      <section className="admin-section" id="member-list">
        <FilteredMembersList
          groupFilter={this.props.selectedGroupId}
          groups={this.props.groups}
          members={this.state.members}
          onSaveMember={this.state.onSave}
        />
      {this.state.members.length === 0 && <aside className="no-entries">No entries found</aside>}
      </section>
    );
  }
}

MembersViewContainer.propTypes = {
  selectedGroupId: React.PropTypes.string,
  groups: React.PropTypes.array,
  onPreAction: React.PropTypes.func,
  onActionError: React.PropTypes.func,
  onActionSuccess: React.PropTypes.func,
  branchId: React.PropTypes.string,
};
