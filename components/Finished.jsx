import React, {Component} from 'react';
import PaypalFinish from './PaypalFinish.jsx';

export default class Finished extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <fieldset>
            <h1 className="form-title">Finish</h1>

            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title"> We have received your details. </h2>
                </div>

                <label>
                    <p>You will soon receive a verification email. To confirm your membership, please click on the link provided in the email.</p>

                    <p>If you don’t receive it, please contact us at membership@pirateparty.org.au </p>

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
