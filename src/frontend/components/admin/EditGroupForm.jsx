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
            <section className="form-container">
                <h2>Create new group</h2>
                <FormFieldLabel fieldName="groupName" isOptional={false} />

                <input id="groupName" type="text" placeholder="e.g. Tuesday 4.30pm" defaultValue="" value={this.state.name} onChange={this.updateName.bind(this)}/>
                <FormFieldLabel fieldName="groupDescription" isOptional={false} />
                <textarea id="groupDescription" type="type" placeholder="Describe your group" defaultValue="" value={this.state.description} onChange={this.updateDescription.bind(this)}/>
                    <button onClick={this.saveChanges.bind(this)}>Save</button>
            </section>


        );
    }

};
