'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

import EditMemberForm from './EditMemberForm.jsx';
import Modal from 'react-modal';

export default class EditMemberButton extends Component {
    constructor(props) {
        super(props);
        this.state = {modalIsOpen: false}
    }

    launchEditForm = () => {
        this.setState({modalIsOpen: true});
    };

    closeEditForm = () => {
        this.setState({modalIsOpen: false});
    };

    render() {
        return (
            <div>
                <button onClick={this.launchEditForm}><span>Edit groups</span></button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeEditForm}>
                    <EditMemberForm participant={this.props.participant} groups={this.props.groups}/>
                </Modal>
            </div>
        )
    }
}
