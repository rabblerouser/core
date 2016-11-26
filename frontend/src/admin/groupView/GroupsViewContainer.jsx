import React, { Component } from 'react';
import { connect } from 'react-redux';

import GroupsView from './GroupsView';
import branchService from '../services/branchService.js';
import MembersViewContainer from '../components/memberView/MembersViewContainer';

import { getSelectedBranchId } from '../reducers/branchReducers';
import { groupsListUpdated, groupSelected } from './actions';
import { clearMessages } from '../actions/';

class GroupsViewContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <section>
        <GroupsView
          onSelectGroup={this.state.onSelect}
        />
        <MembersViewContainer />
      </section>
    );
  }
}

GroupsViewContainer.propTypes = {
  onActivityStart: React.PropTypes.func,
  onGroupSelected: React.PropTypes.func,
  onGroupsListUpdated: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  onGroupsListUpdated: groups => dispatch(groupsListUpdated(groups)),
  onGroupSelected: id => dispatch(groupSelected(id)),
  onActivityStart: () => dispatch(clearMessages()),
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsViewContainer);
