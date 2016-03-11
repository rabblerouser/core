'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {GroupCheckbox} from './GroupCheckbox.jsx'

export default class EditMemberForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let groupCheckboxes = this.props.groups.map( group => (<GroupCheckbox group={group}
                                                                                     participantGroups={this.props.participant.groups}
                                                                                     allGroups={this.props.groups} />));

        return (
            <div>
                <h2>{this.props.participant.firstName} {this.props.participant.lastName}</h2>
               G: {groupCheckboxes}
            </div>
        )
    }
}
