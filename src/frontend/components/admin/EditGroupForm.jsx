'use strict';
import React, {Component} from 'react';
import FormFieldLabel from '../form/FormFieldLabel.jsx';

export default class EditGroupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.group.id,
            name: props.group.name,
            description: props.group.description
        };
    }


    updateName(event) {
        this.setState({name: event.target.value});
    }

    updateDescription(event) {
        this.setState({description: event.target.value});
    }

    saveChanges() {
        this.props.onSave(this.getGroupDetails());
    }

    getGroupDetails() {
        return this.state;
    }

    render() {
        return (
            <div>
                I am a form to be submitted
                <FormFieldLabel fieldName="groupName" isOptional={false} />
                <input id="groupName" type="type" defaultValue="" value={this.state.name} onChange={this.updateName.bind(this)}/>
                <FormFieldLabel fieldName="groupDescription" isOptional={false} />
                <input id="groupDescription" type="type" defaultValue="" value={this.state.description} onChange={this.updateDescription.bind(this)}/>
                    <button onClick={this.saveChanges.bind(this)}>save</button>
            </div>

        );
    }

};
