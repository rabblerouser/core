import React, {Component} from 'react';

export default class PaypalInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
    }

    // componentDidMount() {
    //     this.props.didUpdate(true);
    // }

    render() {
        return (<div className="info-box payment">
            <div className="info-body">
                  <strong>You will be redirected to PayPal after clicking continue.</strong>
            </div>
        </div>)
    }
}
