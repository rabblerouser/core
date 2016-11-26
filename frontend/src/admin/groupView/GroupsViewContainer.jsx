import React, { Component } from 'react';
import { connect } from 'react-redux';

import GroupsView from './GroupsView';
import branchService from '../services/branchService.js';
import groupService from '../services/groupService.js';
import MembersViewContainer from '../components/memberView/MembersViewContainer';

import { getSelectedBranchId } from '../reducers/branchReducers';
import { groupsListUpdated, groupSelected, groupCreated, groupUpdated, groupRemoved } from './actions';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/';
import { getSelectedGroupId } from './reducers';

class GroupsViewContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      onSave: groupDetails => {
        this.props.onActivityStart();
        if (this.props.selectedGroupId !== groupDetails.id) {
          groupService.createGroup(groupDetails, this.props.branchId)
          .then(savedGroup => {
            this.props.onGroupCreated(savedGroup);
            this.props.onActivitySuccess('Group saved');
          })
          .catch(this.props.onActivityFailure);
        } else {
          groupService.updateGroup(groupDetails, this.props.branchId)
          .then(savedGroup => {
            this.props.onGroupUpdated(savedGroup);
            this.props.onActivitySuccess('Group saved');
          })
          .catch(this.props.onActivityFailure);
        }
      },
      onSelect: selected => {
        this.props.onActivityStart();
        this.props.onGroupSelected(selected);
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchGroups(nextProps.branchId)
        .then(groups => this.props.onGroupsListUpdated(groups));
    }
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
  onGroupCreated: React.PropTypes.func,
  onGroupUpdated: React.PropTypes.func,
  onGroupRemoved: React.PropTypes.func,
  onGroupSelected: React.PropTypes.func,
  onGroupsListUpdated: React.PropTypes.func,
  selectedGroupId: React.PropTypes.string,
  branchId: React.PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onGroupsListUpdated: groups => dispatch(groupsListUpdated(groups)),
  onGroupSelected: id => dispatch(groupSelected(id)),
  onGroupCreated: group => dispatch(groupCreated(group)),
  onGroupUpdated: group => dispatch(groupUpdated(group)),
  onGroupRemoved: id => dispatch(groupRemoved(id)),
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

const mapStateToProps = state => ({
  selectedGroupId: getSelectedGroupId(state),
  branchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsViewContainer);
