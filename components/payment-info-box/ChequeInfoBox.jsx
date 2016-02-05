import React, {Component} from 'react';

export default class ChequeInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
    }
    //
    // componentDidMount() {
    //     this.props.didUpdate(true);
    // }

    render() {
        return (<div className="info-box payment">
            <div className="info-body">
                  <strong>An invoice with a reference number will be sent by email. Please quote your number when you make your payment.</strong>
            </div>
        </div>)
    }
}
