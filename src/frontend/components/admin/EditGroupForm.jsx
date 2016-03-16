'use strict';
import React, {Component} from 'react';
import FormFieldLabel from '../form/FormFieldLabel.jsx';
import groupValidator from '../../services/groupValidator.js';

export default class EditGroupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.group.id,
            name: props.group.name,
            description: props.group.description,
            invalidFields: []
        };
    }

    updateName(event) {
        this.setState({name: event.target.value});
    }

    updateDescription(event) {
        this.setState({description: event.target.value});
    }

    saveChanges() {
        let errors = groupValidator.isValid(this.getGroupDetails());
        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSave(this.getGroupDetails());
        }
    }

    getGroupDetails() {
        return this.state;
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    render() {
        return (
            <section className="form-container">
                <h2>Create new group</h2>
                <FormFieldLabel fieldName="groupName" isOptional={false} hasError={this.isValidationError('name')} />
                <input id="groupName" type="text" placeholder="e.g. Tuesday 4.30pm" defaultValue="" value={this.state.name} onChange={this.updateName.bind(this)}/>
                    <FormFieldLabel fieldName="groupDescription" isOptional={false} hasError={this.isValidationError('description')} />
                <textarea id="groupDescription" type="type" placeholder="Describe your group" defaultValue="" value={this.state.description} onChange={this.updateDescription.bind(this)}/>
                    <button onClick={this.saveChanges.bind(this)}>Save</button>
            </section>
        );
    }

};
