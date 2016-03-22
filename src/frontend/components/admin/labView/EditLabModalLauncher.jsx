'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

import EditLabForm from './EditLabForm.jsx';
import Modal from 'react-modal';

export default class EditLabModalLauncher extends Component {
    constructor(props) {
        super(props);
        this.state = {modalIsOpen: false};
    }

    launchEditForm() {
        this.setState({modalIsOpen: true});
    }

    closeEditForm() {
        this.setState({modalIsOpen: false});
    }

    render() {
        let customStyle = {
            content: {
                bottom: 'none'
            }
        };
        return (
            <button onClick={this.launchEditForm.bind(this)}
                className="edit"
                title="Edit details">
                <span>Edit details</span>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeEditForm.bind(this)}
                    style={customStyle}>
                    <EditLabForm
                        title="Edit lab"
                        onSave={this.props.onSave}
                        lab={this.props.lab}
                        onSuccess={this.closeEditForm.bind(this)}/>
                </Modal>
            </button>
        )
    }
}
