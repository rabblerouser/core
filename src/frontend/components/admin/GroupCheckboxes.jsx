'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

export default class GroupCheckboxes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let checkboxes = this.props.allGroups.map(
            group => {
                return (<label><input type="checkbox" name="{group.id}"/>{group.name}</label>);
            }
        );

        return (
            <div>
                {checkboxes}
            </div>
        )
    }
}
