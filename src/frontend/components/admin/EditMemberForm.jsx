'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

export default class EditMemberForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.participant.firstName} {this.props.participant.lastName}</h2>
                <p>Groups: {this.props.participant.groups}</p>
                <p>All groups: {JSON.stringify(this.props.groups)}</p>
            </div>
        )
    }
}
