import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import GroupsView from './GroupsView';
import branchService from '../services/branchService.js';
import groupService from '../services/groupService.js';
import MembersViewContainer from '../components/memberView/MembersViewContainer';

import { getSelectedBranchId } from '../reducers/branchReducers';
import { groupsListUpdated, groupSelected } from './actions';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/';

class GroupsViewContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroupId: 'unassigned',
      onSave: groupDetails => {
        this.props.onActivityStart();
        const saveAction = this.state.groups.find(group => group.id === groupDetails.id) === undefined ?
          groupService.createGroup :
          groupService.updateGroup;
        saveAction(groupDetails, this.props.branchId)
          .then(savedGroup => {
            this.update(this.state.groups, savedGroup);
            this.props.onActivitySuccess('Group saved');
          })
          .catch(this.props.onActivityFailure);
      },
      onSelect: selected => {
        this.props.onActivityStart();
        this.props.onGroupSelected(selected);
      },
      onDelete: selected => {
        this.props.onActivityStart();
        groupService.deleteGroup(selected, this.props.branchId)
          .then(() => {
            this.removeAndUpdateGroups(this.state.groups, selected);
            this.props.onActivitySuccess('Group deleted');
          })
          .catch(this.props.onActivityFailure);
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchGroups(nextProps.branchId)
        .then(groups => this.props.onGroupsListUpdated(groups));
    }
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

  removeAndUpdate(collection, element) {
    const oldElement = collection.find(item => item.id === element.id);
    this.setState({ groups: _.without(collection, oldElement) });
  }

  removeAndUpdateGroups(collection, element) {
    this.removeAndUpdate(collection, element);
    this.props.onGroupSelected('unassigned');
  }

  render() {
    return (
      <section>
        <GroupsView
          onSaveGroup={this.state.onSave}
          onDeleteGroup={this.state.onDelete}
          onSelectGroup={this.state.onSelect}
        />
        <MembersViewContainer />
      </section>
    );
  }
}

GroupsViewContainer.propTypes = {
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
  onGroupSelected: React.PropTypes.func,
  onGroupsListUpdated: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onGroupsListUpdated: groups => dispatch(groupsListUpdated(groups)),
  onGroupSelected: id => dispatch(groupSelected(id)),
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsViewContainer);
