'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import GroupCheckboxes from './GroupCheckboxes.jsx'

export default class EditMemberForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.participant.firstName} {this.props.participant.lastName}</h2>
                <GroupCheckboxes allGroups={this.props.participant.allGroups} participantGroups={this.props.participant.Groups} />
            </div>
        )
    }
}
