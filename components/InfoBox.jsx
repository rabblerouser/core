import React, {Component} from 'react';

export default class InfoBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="info-box">
            <div className="info-heading">
                <h2>You are eligible for a Full Membership.</h2>
                <i>What are the different membership types?</i>
            </div>
            <div className="info-body">
                As an Australian citizen with no other political party, you are entitled to be a Full Member. As such, you can:
                <ul>
                    <li>Be elected into a formal position within the party, at any level;</li>
                    <li>Where eligible, and approved by the nomination processes within this constitution, stand as a candidate in any election the party contests;</li>
                    <li>Communicate and submit policy amendment proposals and constitutional amendment proposals;</li>
                    <li>Participate in policy and issue discussion, debate and partake in the decision making process in accordance with this constitution;</li>
                    <li>Where eligible, participate in working groups defined by the National Council or any organ of the Party; and</li>
                    <li>Vote at Party Meetings, Congresses and Policy Formulation, Development and Adoption proceedings.</li>
                </ul>
                As a Full Member, you can pay whatever you want to join (even $0!)
            </div>
        </div>
    }
}
