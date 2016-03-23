'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import AddOrganiserForm from './AddOrganiserForm.jsx';
import Modal from 'react-modal';

export default class AddOrganiserModalLauncher extends Component {
    constructor(props) {
        super(props);
        this.state = {modalIsOpen: false};
    }

    launchAddForm () {
        this.setState({modalIsOpen: true});
    }

    closeAddForm () {
        this.setState({modalIsOpen: false});
    }

    render() {
        let customStyle = {
            content:{
                bottom: 'none'
            }
        };
        return (
                <button onClick={this.launchAddForm.bind(this)}
                    className="new"
                    title="New organiser">
                    <span>New organiser</span>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeAddForm.bind(this)}
                        style={customStyle}>
                        <AddOrganiserForm
                            onSave={this.props.onSave}
                            onSuccess={this.closeAddForm.bind(this)}/>
                    </Modal>
                </button>
        )
    }
}
