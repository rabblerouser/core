import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Errors extends Component {
    constructor(props) {
        super(props);
        this.getClass = this.getClass.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    getClass(invalidaFields) {
        return invalidaFields.length >= 1 ? "validationErrors" : "hidden";
    }

    componentDidUpdate() {
        if(this.props.scrollToError) {
            ReactDOM.findDOMNode(this).scrollIntoView(false);
        }
    }

    render() {
        return (<div className={this.getClass(this.props.invalidFields)}>
                 <div className="validationErrors-text">
                    <span>{this.props.validationErrorText}</span>
                    <ul className="errors">
                       {this.props.invalidFields.map(function(field){
                           return <li>{field}</li>;
                       })}
                    </ul>
                </div>
              </div>)
    }
}
