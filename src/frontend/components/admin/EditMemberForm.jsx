'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import GroupCheckboxes from './GroupCheckboxes.jsx'

export default class EditMemberForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGroupIds: this.props.participant.Groups.map(group => group.id)
        };
    }

    saveChanges() {
        this.props.onSave(this.state.selectedGroupIds);
    }

    onChange(event) {
        let newGroups = this.state.selectedGroupIds.slice(0);
        if(event.target.checked) {
            newGroups.push(event.target.value);
        } else {
            let group = newGroups.find(id => id === event.target.value);
            newGroups = _.without(newGroups, group);
        }
        this.setState({ selectedGroupIds: newGroups });
    }

    render() {
        return (
            <section className="form-container">
                <h2>{this.props.participant.firstName} {this.props.participant.lastName}</h2>
                <p>Select one or more groups for the participant to join.</p>
                <GroupCheckboxes onChange={this.onChange.bind(this)}
                                 allGroups={this.props.participant.allGroups}
                                 participantGroups={this.props.participant.Groups} />
                <button onClick={this.saveChanges.bind(this)}>Save</button>
            </section>
        )
    }
}
