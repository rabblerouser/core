import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.disabled) {
            return <button disabled type={this.props.type} id={this.props.id} onClick={this.props.onClick}>
                {this.props.textContent}
            </button>
        }
        return <button type={this.props.type} id={this.props.id} onClick={this.props.onClick}>
            {this.props.textContent}
        </button>
    }
}
