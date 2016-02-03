import React, {Component} from 'react';
var ReactDOM = require('react-dom');
var Modal = require('react-modal');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    padding               : '0px'
  }
};

export default class MembershipTypeExplanation extends Component {
  constructor(props) {
      super(props);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.state = {modalIsOpen : false};
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <a onClick={this.openModal}><span className="circled">?</span>  What are the different membership types?</a>
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles} >
                  <div className='modal-header'>
                      <img src ='/images/close_button.svg' onClick={this.closeModal} className='close_button'/>
                      <div className='box-header'>
                          <img src ='/images/pirate_party_logo.svg' className='logo'/>
                          <h2>Membership Types</h2>
                      </div>
                  </div>

                  <div className="box-column">
                      <h3>Full Membership</h3>
                      <h4>Australian citizens who do not belong to any other political party.</h4>
                  </div>
                  <div className="box-column">
                      <h3>Supporter Membership</h3>
                      <h4>Members who belong to another Political Party, but wish to support the Pirate Party.</h4>
                  </div>
                  <div className="box-column">
                      <h3>Permanent Resident Membership</h3>
                      <h4>Members who have a permanent resident visa and do not belong to any other political party.</h4>
                  </div>
                  <div className="box-column">
                      <h3>International Membership</h3>
                      <h4>International citizens or members with a temporary visa.</h4>
                  </div>
            </Modal>
      </div>
    );
  }
};
