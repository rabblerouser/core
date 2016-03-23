'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import EditLabFields from './EditLabFields.jsx';
import labValidator from '../../../services/labValidator';

export default class EditGroupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invalidFields: [],
            fieldValues: this.props.lab
        };
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    saveChanges() {
        let lab = Object.assign({}, this.state.fieldValues);
        let errors = (labValidator.isValid(lab));
        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(lab);
        }
    }

    onChange(fieldName) {
        let editLabComponent = this;

        return function(event) {
            let newValue = {[fieldName] : event.target.value};
            let newFieldValues = Object.assign({}, editLabComponent.state.fieldValues, newValue);
            editLabComponent.setState({
                fieldValues: newFieldValues
            });
        };
    }
    render() {
        return (
            <section className="form-container">
                <header className="details-header">
                    <span className='title'>
                        Edit lab
                    </span>
                    <span className='actions'>
                        <button className="save" onClick={this.saveChanges.bind(this)}>Save</button>
                    </span>
                </header>
                <EditLabFields onChange={this.onChange.bind(this)}
                              invalidFields={this.state.invalidFields}
                              formValues={this.state.fieldValues}
                />
            </section>
        )
    }

};
