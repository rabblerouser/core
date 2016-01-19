import React, {Component} from 'react';

export default class Errors extends Component {
    constructor(props) {
        super(props);
        this.getClass = this.getClass.bind(this);
    }

    getClass(invalidaFields) {
      return invalidaFields.length > 1 ? "validationErrors" : "hidden";
    }

    render() {
       return (<div className={this.getClass(this.props.invalidFields)}>
                 <img src="/images/cross.svg" />
                 <div className="validationErrors-text">
                    <span>Please check the following fields:</span>
                    <ul className="errors">
                       {this.props.invalidFields.map(function(field){
                           return <li>{field}</li>;
                       })}
                    </ul>
                </div>
              </div>)
    }
}
