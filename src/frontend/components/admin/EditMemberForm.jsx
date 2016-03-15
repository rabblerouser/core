'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import GroupCheckboxes from './GroupCheckboxes.jsx'

export default class EditMemberForm extends Component {
    constructor(props) {
        super(props);
    }

    saveChanges() {
        this.props.onSave('placeholder');
    }

    render() {
        return (
            <section className="form-container">
                <h2>Update participant</h2>
                <h2>{this.props.participant.firstName} {this.props.participant.lastName}</h2>
                <GroupCheckboxes allGroups={this.props.participant.allGroups} participantGroups={this.props.participant.Groups} />
                    <button onClick={this.saveChanges.bind(this)}>Save group</button>
            </section>
        )
    }
}
