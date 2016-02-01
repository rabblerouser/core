import React, {Component} from 'react';

export default class DirectDebitInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
    }

    // componentDidMount() {
    //     this.props.didUpdate(true);
    // }

    render() {
        return (<div className="info-box">
            <div className="info-body">
                  <strong>An invoice will be sent by email. Please enter the number
                  found in your invoice when you make your payment.</strong>
            </div>
        </div>)
    }
}
