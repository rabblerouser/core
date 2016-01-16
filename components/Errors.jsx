import React, {Component} from 'react';

export default class Errors extends Component {
    constructor(props) {
        super(props);
    }

    render() {
       return <ul className="errors">
            {this.props.invalidFields.map(function(field){
                return <li>{field}</li>;
            })}
        </ul>
    }
}
