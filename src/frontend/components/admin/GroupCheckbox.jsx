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
                <p>P: {JSON.stringify(this.props.participantGroups)} <br />
                    A: {JSON.stringify(this.props.allGroups)}</p>
            </div>
        )
    }
}
