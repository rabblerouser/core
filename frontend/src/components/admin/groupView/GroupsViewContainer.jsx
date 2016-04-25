import React, { Component } from 'react';
import _ from 'lodash';
import GroupsView from './GroupsView.jsx';
import labService from '../../../services/labService.js';
import groupService from '../../../services/groupService.js';
import ParticipantsViewContainer from '../participantView/ParticipantsViewContainer.jsx';

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
        saveAction(groupDetails, this.props.labId)
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
        groupService.deleteGroup(selected, this.props.labId)
          .then(() => {
            this.removeAndUpdateGroups(this.state.groups, selected);
            this.props.onActionSuccess('Group deleted');
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


  componentWillReceiveProps(nextProps) {
    if (nextProps.labId && nextProps.labId !== this.props.labId) {
      labService.getLabGroups(nextProps.labId)
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
        <ParticipantsViewContainer
          selectedGroupId={this.state.selectedGroupId}
          groups={this.state.groups}
          onPreAction={this.props.onPreAction}
          onActionError={this.props.onActionError}
          onActionSuccess={this.props.onActionSuccess}
          labId={this.props.labId}
        />
      </section>
    );
  }
}

GroupsViewContainer.propTypes = {
  onPreAction: React.PropTypes.func,
  onActionError: React.PropTypes.func,
  onActionSuccess: React.PropTypes.func,
  labId: React.PropTypes.string,
};
