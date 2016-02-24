import React, {Component} from 'react';

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
            </div>
        </fieldset>
    }
}
