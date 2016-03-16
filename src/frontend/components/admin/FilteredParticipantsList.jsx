'use strict';
import React from 'react';
import ParticipantsList from './ParticipantsList.jsx';

const FilteredParticipantsList = ({ groupFilter, participants, groups, onSaveParticipant }) => {

    function filterParticipantsList() {
        if (!groupFilter) {
            return participants;
        }
        else {
            return participants.filter( element => {
                return element.groups.filter( group => {
                    return group.id === groupFilter;
                }).length > 0;
            });
        }
    }

    return (
        <ParticipantsList
            participants={ filterParticipantsList(groupFilter) }
            groups={ groups }
            onSave= { onSaveParticipant }
        />
    )
}

FilteredParticipantsList.propTypes = {
    groupFilter: React.PropTypes.string,
    participants: React.PropTypes.array
};

export default FilteredParticipantsList;
