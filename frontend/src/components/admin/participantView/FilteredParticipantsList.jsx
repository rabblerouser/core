import React from 'react';
import ParticipantListTable from './ParticipantListTable.jsx';

const FilteredParticipantsList = ({ groupFilter, participants, groups, onSaveParticipant }) => {
  function filterParticipantsList() {
    switch (groupFilter) {
      case 'all' :
        return participants;
      case 'unassigned' :
        return participants.filter(participant => participant.groups.length === 0);
      default:
        return participants.filter(participant => participant.groups.includes(groupFilter));
    }
  }

  return (
    <ParticipantListTable participants={filterParticipantsList()} groups={groups} onSaveMember={onSaveParticipant} />
  );
};

FilteredParticipantsList.propTypes = {
  groupFilter: React.PropTypes.string,
  participants: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveParticipant: React.PropTypes.func,
};

export default FilteredParticipantsList;
