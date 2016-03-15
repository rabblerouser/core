'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

export default class GroupCheckbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>This group: {this.props.group}</p>
                <p>Groups of this participant: {JSON.stringify(this.props.participantGroups)}</p>
            </div>
        )
    }
}
