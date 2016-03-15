'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';

export default class GroupCheckboxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGroupIds: this.props.participantGroups.map(group => group.id)
        };
    }

    isSelected(testGroup) {
        return this.props.participantGroups.find(group => group.id === testGroup.id) !== undefined;
    }

    updateSelection(event) {
        let newGroups = this.state.selectedGroupIds.slice(0);
        if(event.target.checked) {
            newGroups.push(event.target.value);
        } else {
            let group = newGroups.find(id => id === event.target.value);
            newGroups = _.without(newGroups, group);
        }
        this.setState({ selectedGroupIds: newGroups});
    }

    render() {
        let checkboxes = this.props.allGroups.map(
            group => {
                return (<label><input type="checkbox" onChange={this.updateSelection.bind(this)} defaultChecked={this.isSelected(group)} value={group.id} name="{group.id}"/>{group.name}</label>);
            }
        );

        return (
            <section className="selectGroups">
                {checkboxes}
            </section>
        )
    }
}
