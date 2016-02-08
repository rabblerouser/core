import React, {Component} from 'react';

export default class RenewalFinish extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <fieldset>
            <h1 className="form-title">Thank You</h1>

            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title"> We have received your details. </h2>
                </div>

                <label>
                    <p>Thank you for renewing your Pirate Party membership. If you have any concerns please contact us at <u><b> membership@pirateparty.org.au </b></u></p>

                    {this.props.paypalFinish ? <PaypalFinish /> : null}
                </label>
                <div className="navigation">
                    <a href='/'>
                        <button>Back To The Website</button>
                    </a>
                </div>
            </div>
        </fieldset>
    }
}
