import React, {Component} from 'react';
import FilteredParticipantsList from './FilteredParticipantsList.jsx';
import labService from '../../../services/labService.js';
import memberService from '../../../services/memberService.js';

export default class ParticipantsViewContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            onSave: (participant) => {
                this.props.onPreAction();
                memberService.update(participant, this.props.labId)
                .then((savedParticipant) => {
                    this.update(this.state.participants, savedParticipant);
                    this.props.onActionSuccess('Participant saved');
                })
                .catch(this.props.onActionError);
            }
        };
    }

    update(collection, element) {
        let newElements = collection.slice(0);
        let oldElement = newElements.find (g => g.id === element.id);
        if(oldElement) {
            Object.assign(oldElement, element);
        }
        else {
            newElements.push(element);
        }
        this.setState({participants: newElements});
    }

    updateIfGroupRemoved(oldGroups, newGroups) {
        if (!oldGroups || !newGroups || newGroups.length >= oldGroups.length) {
            return;
        }
        let removedGroup = _.difference(oldGroups, newGroups)[0];

        let updatedParticipants = this.state.participants;
        updatedParticipants = updatedParticipants.map(p => {
            p.groups = _.reject(p.groups, g => g === removedGroup.id);
            return p;
        });
        this.setState({participants: updatedParticipants});

    }

    componentWillReceiveProps(nextProps) {
        this.updateIfGroupRemoved(this.props.groups, nextProps.groups);

        if(nextProps.labId && nextProps.labId !== this.props.labId) {
            labService.getLabParticipants(nextProps.labId)
            .then( participants => {
                this.setState({participants: participants});
            });
        }
    }

    getSelectedGroup() {
        if(this.props.selectedGroupId === 'all' || this.props.selectedGroupId === 'unassigned') {
            return;
        }
        return this.props.groups.find(group => group.id === this.props.selectedGroupId);
    }

    render() {
        return (
            <FilteredParticipantsList
                groupFilter={ this.props.selectedGroupId }
                groups={ this.props.groups }
                participants={ this.state.participants }
                onSaveParticipant= { this.state.onSave }
            />
        )
    }
}

ParticipantsViewContainer.propTypes = {
    selectedGroupId: React.PropTypes.string,
    groups: React.PropTypes.array,
    onPreAction: React.PropTypes.func,
    onActionError: React.PropTypes.func,
    onActionSuccess: React.PropTypes.func,
    labId : React.PropTypes.string
};

export default ParticipantsViewContainer
