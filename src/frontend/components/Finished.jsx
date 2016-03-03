import React, {Component} from 'react';
import { Resources } from '../config/strings';

export default class Finished extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <section>
            <h1 className="form-title">Finish</h1>

            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title"> Thank you, we have received your details. </h2>
                </div>
                <p>The Lab will be in touch with you shortly to discuss your booking.</p>
                <div className="navigation">
                  <p><a onClick={this.props.previousStep} href={Resources.theLabHome}>Return to The Lab</a></p>
                </div>
            </div>
        </section>
    }
}
