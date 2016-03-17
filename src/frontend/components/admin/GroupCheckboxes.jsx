'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

export default class GroupCheckboxes extends Component {
    constructor(props) {
        super(props);
    }

    isSelected(testGroup) {
        return this.props.participantGroups.includes(testGroup.id);
    }

    render() {
        let checkboxes = this.props.allGroups.map(
            group => {
                return (<label key={group.id}>
                            <input type="checkbox"
                                onChange={this.props.onChange}
                                defaultChecked={this.isSelected(group)}
                                value={group.id} />
                            {group.name}
                        </label>);
            }
        );

        return (
            <section className="selectGroups">
                {checkboxes}
            </section>
        )
    }
}
