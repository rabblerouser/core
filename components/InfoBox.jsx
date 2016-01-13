import React, {Component} from 'react';

export default class InfoBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="info-box" style={{display: this.props.display}}>
            <div className="info-box-header">
                Hooray! You are eligible for a Full Membership.
            </div>
            <div className="info-box-body">
                You are entitled to:
                <ul>
                    <li>Be elected into a formal position within the party, at any level;</li>
                    <li>Where eligible, and approved by the nomination processes within this constitution, stand as a candidate in any election the party contests;</li>
                    <li>Communicate and submit policy amendment proposals and constitutional amendment proposals;</li>
                    <li>Participate in policy and issue discussion, debate and partake in the decision making process in accordance with this constitution;</li>
                    <li>Where eligible, participate in working groups defined by the National Council or any organ of the Party; and</li>
                    <li>Vote at Party Meetings, Congresses and Policy Formulation, Development and Adoption proceedings.</li>
                </ul>
            </div>
        </div>
    }
}
