'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';

import EditMemberForm from './EditMemberForm.jsx';
import Modal from 'react-modal';

export default class EditMemberButton extends Component {
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
            <div>
                <button onClick={this.launchEditForm.bind(this)}><span>Edit groups</span></button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeEditForm.bind(this)} style={customStyle}>
                    <EditMemberForm
                        participant={this.props.participant}
                        onSave={this.props.onSave}
                        onSuccess={this.closeEditForm.bind(this)}/>
                </Modal>
            </div>
        )
    }
}
