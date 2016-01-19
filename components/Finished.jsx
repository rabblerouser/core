import React, {Component} from 'react';

export default class ConfirmDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <fieldset>
            <h1 className="form-title">Finish</h1>

            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title"> Thank You </h2>
                </div>
                <label>
                    <p>We have received your details.</p>

                    <p>You will soon receive a verification email at {this.props.email}. Please click on the link in the email so that your membership can be verified.</p>

                    <p>If you don’t receive it, please contact us at membership@pirateparty.org.au </p>
                </label>
                <div className="navigation">
                    <button onClick={this.props.nextStep}>Close</button>
                </div>
            </div>
        </fieldset>
    }
}
