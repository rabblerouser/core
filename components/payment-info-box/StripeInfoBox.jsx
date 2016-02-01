import React, {Component} from 'react';

export default class StripeInfoBox extends Component {
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
                  <strong> Click continue to proceed with payment.</strong>
            </div>
        </div>)
    }
}
