import React, {Component} from 'react';
import { Resources } from '../config/strings';

export default class Finished extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <fieldset>
            <h1 className="form-title">Finish</h1>

            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title"> Thank you, we have received your details. </h2>
                </div>
                <p>Somebody from your nominated lab will be in touch with you within the next few weeks with more information.</p>
                <div className="navigation">
                  <p><a onClick={this.props.previousStep} href={Resources.theLabHome}>Return to The Lab</a></p>
                </div>
            </div>
        </fieldset>
    }
}
