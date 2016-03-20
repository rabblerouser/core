'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import EditGroupForm from './EditGroupForm.jsx';
import Modal from 'react-modal';

export default class AddGroupModalLauncher extends Component {
    constructor(props) {
        super(props);
        this.state = {modalIsOpen: false};
    }

    launchEditForm () {
        this.setState({modalIsOpen: true});
    }

    closeEditForm () {
        this.setState({modalIsOpen: false});
    }

    render() {
        let customStyle = {
            content:{
                bottom: 'none'
            }
        };
        return (
                <button onClick={this.launchEditForm.bind(this)}
                    className="newGroup"
                    title="New group">
                    <span>New group</span>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeEditForm.bind(this)}
                        style={customStyle}>
                        <EditGroupForm
                            title="New group"
                            onSave={this.props.onSave}
                            group={{}}
                            onSuccess={this.closeEditForm.bind(this)}/>
                    </Modal>
                </button>
        )
    }
}
