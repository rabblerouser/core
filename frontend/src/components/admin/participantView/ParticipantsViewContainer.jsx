import React, { Component } from 'react';
import _ from 'lodash';
import FilteredParticipantsList from './FilteredParticipantsList.jsx';
import branchService from '../../../services/branchService.js';
import memberService from '../../../services/memberService.js';

export default class ParticipantsViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      onSave: member => {
        this.props.onPreAction();
        memberService.update(member, this.props.branchId)
          .then(savedParticipant => {
            this.update(this.state.participants, savedParticipant);
            this.props.onActionSuccess('Participant saved');
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
    this.setState({ participants: newElements });
  }

  updateIfGroupRemoved(oldGroups, newGroups) {
    if (!oldGroups || !newGroups || newGroups.length >= oldGroups.length) {
      return;
    }
    const removedGroup = _.difference(oldGroups, newGroups)[0];

    const updatedParticipants = this.state.participants.map(participant => {
      /* eslint no-param-reassign: "warn"*/
      // TODO: Don't mutate here, and remove eslint config above!
      participant.groups = _.reject(participant.groups, group => group === removedGroup.id);
      return participant;
    });
    this.setState({ participants: updatedParticipants });
  }

  componentWillReceiveProps(nextProps) {
    this.updateIfGroupRemoved(this.props.groups, nextProps.groups);

    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchMembers(nextProps.branchId)
        .then(participants => {
          this.setState({ participants });
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
      <section className="admin-section" id="participant-list">
        <FilteredParticipantsList
          groupFilter={this.props.selectedGroupId}
          groups={this.props.groups}
          participants={this.state.participants}
          onSaveParticipant={this.state.onSave}
        />
      {this.state.participants.length === 0 && <aside className="no-entries">No entries found</aside>}
      </section>
    );
  }
}

ParticipantsViewContainer.propTypes = {
  selectedGroupId: React.PropTypes.string,
  groups: React.PropTypes.array,
  onPreAction: React.PropTypes.func,
  onActionError: React.PropTypes.func,
  onActionSuccess: React.PropTypes.func,
  branchId: React.PropTypes.string,
};
