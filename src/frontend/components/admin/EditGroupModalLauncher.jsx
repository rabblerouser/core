'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

import EditGroupForm from './EditGroupForm.jsx';
import Modal from 'react-modal';

export default class EditGroupModalLauncher extends Component {
    constructor(props) {
        super(props);
        this.state = {modalIsOpen: false};
    }

    launchEditForm = () => {
        this.setState({modalIsOpen: true});
    };

    closeEditForm = () => {
        this.setState({modalIsOpen: false});
    };

    render() {

        let customStyle = {

            content:{
                bottom: 'none'
            }
        };
        return (
            <div>
                <button onClick={this.launchEditForm} className="editGroup" title="Edit group details"><span>Edit group details</span></button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeEditForm}  style={customStyle}>
                    <EditGroupForm onSave={this.props.onSave} group={this.props.group}/>
                </Modal>
            </div>
        )
    }
}
