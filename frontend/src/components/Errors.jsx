import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Errors extends Component {
  constructor(props) {
    super(props);
    this.getClass = this.getClass.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate() {
    if (this.props.scrollToError) {
      ReactDOM.findDOMNode(this).scrollIntoView(false);
    }
  }

  getClass(errorTitle) {
    return errorTitle ? 'validationErrors' : 'hidden';
  }

  render() {
    return (
      <div className={this.getClass(this.props.errorTitle)}>
        <div className="validationErrors-text">
          <span>{this.props.errorTitle}</span>
          <ul className="errors">
            {this.props.invalidFields.map(field => <li key={field}>{field}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

Errors.propTypes = {
  errorTitle: React.PropTypes.string,
  scrollToError: React.PropTypes.bool,
  invalidFields: React.PropTypes.array.isRequired,
};

export default Errors;
