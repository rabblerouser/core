import React, {Component} from 'react';

export default class InlineError extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(!this.props.isError){
          return null;
        }
        return (
        <span className="errors">
            <br/>
            {this.props.errorMessage}
        </span>);
    }
}
