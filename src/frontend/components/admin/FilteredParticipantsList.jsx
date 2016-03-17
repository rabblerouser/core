'use strict';
import React from 'react';
import ParticipantsList from './ParticipantsList.jsx';

const FilteredParticipantsList = ({ groupFilter, participants, groups, onSaveParticipant }) => {

    function filterParticipantsList() {
        return !groupFilter ? participants : participants.filter( participant => participant.groups.includes(groupFilter) );
    }

    return (
        <ParticipantsList
            participants={ filterParticipantsList() }
            groups={ groups }
            onSave= { onSaveParticipant }
        />
    )
}

FilteredParticipantsList.propTypes = {
    groupFilter: React.PropTypes.string,
    participants: React.PropTypes.array,
    groups: React.PropTypes.array,
    onSaveParticipant: React.PropTypes.func
};

export default FilteredParticipantsList;
