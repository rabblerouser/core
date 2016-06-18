import React, { Component } from 'react';
import _ from 'lodash';
import GroupsView from './GroupsView.jsx';
import branchService from '../../../services/branchService.js';
import groupService from '../../../services/groupService.js';
import MembersViewContainer from '../memberView/MembersViewContainer.jsx';

export default class GroupsViewContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroupId: 'unassigned',
      onSave: groupDetails => {
        this.props.onPreAction();
        const saveAction = this.state.groups.find(group => group.id === groupDetails.id) === undefined ?
          groupService.createGroup :
          groupService.updateGroup;
        saveAction(groupDetails, this.props.branchId)
          .then(savedGroup => {
            this.update(this.state.groups, savedGroup);
            this.props.onActionSuccess('Group saved');
          })
          .catch(this.props.onActionError);
      },
      onSelect: selected => {
        this.props.onPreAction();
        this.updateGroupSelection(selected);
        this.setState({ selectedGroupId: selected });
      },
      onDelete: selected => {
        this.props.onPreAction();
        groupService.deleteGroup(selected, this.props.branchId)
          .then(() => {
            this.removeAndUpdateGroups(this.state.groups, selected);
            this.props.onActionSuccess('Group deleted');
          })
          .catch(this.props.onActionError);
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchGroups(nextProps.branchId)
        .then(groups => {
          this.setState({ groups });
        });
    }
  }

  getSelectedGroup() {
    if (this.state.selectedGroupId === 'all' || this.state.selectedGroupId === 'unassigned') {
      return null;
    }
    return this.state.groups.find(group => group.id === this.state.selectedGroupId);
  }

  update(collection, element) {
    const newElements = collection.slice(0);
    const oldElement = newElements.find(g => g.id === element.id);
    if (oldElement) {
      Object.assign(oldElement, element);
    } else {
      newElements.push(element);
    }
    this.setState({ groups: newElements });
  }

  updateGroupSelection(selected) {
    const groups = this.state.groups.map(group => Object.assign({}, group, { selected: group.id === selected }));
    this.setState({ groups });
  }

  removeAndUpdate(collection, element) {
    const oldElement = collection.find(item => item.id === element.id);
    this.setState({ groups: _.without(collection, oldElement) });
  }

  removeAndUpdateGroups(collection, element) {
    this.removeAndUpdate(collection, element);
    this.setState({ selectedGroupId: 'unassigned' });
  }

  render() {
    return (
      <section>
        <GroupsView
          selectedGroup={this.getSelectedGroup()}
          groups={this.state.groups}
          onSaveGroup={this.state.onSave}
          onDeleteGroup={this.state.onDelete}
          onSelectGroup={this.state.onSelect}
        />
        <MembersViewContainer
          selectedGroupId={this.state.selectedGroupId}
          groups={this.state.groups}
          onPreAction={this.props.onPreAction}
          onActionError={this.props.onActionError}
          onActionSuccess={this.props.onActionSuccess}
          branchId={this.props.branchId}
        />
      </section>
    );
  }
}

GroupsViewContainer.propTypes = {
  onPreAction: React.PropTypes.func,
  onActionError: React.PropTypes.func,
  onActionSuccess: React.PropTypes.func,
  branchId: React.PropTypes.string,
};
