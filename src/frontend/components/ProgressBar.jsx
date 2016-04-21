import React, { Component } from 'react';

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.getClass = this.getClass.bind(this);
  }

  getClass(progressStep) {
    if (progressStep < this.props.progress) {
      return 'visited';
    } else if (progressStep === this.props.progress) {
      return 'active';
    }
    return 'unvisited';
  }

  render() {
    return (
      <div className="header">
        <img src="/images/the_lab_logo_signup_page.png" alt="Sign Up" />
        <ul className="progress-bar">
          <li className={this.getClass(1)} id="progress-details">Details</li>
          <li className={this.getClass(2)} id="progress-finished">Finish</li>
        </ul>
      </div>
    );
  }
}
