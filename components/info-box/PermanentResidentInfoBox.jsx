import React, {Component} from 'react';
import MembershipTypeExplanation from './MembershipTypeExplanation.jsx';

export default class PermanentResidentInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }
    render() {
        return (<div className="info-box">
            <div className="info-heading">
                <h3>You are entitled to a Permanent Resident Membership.</h3>
                <MembershipTypeExplanation />
            </div>
            <div className="info-body">
              Permanent residents can do the following, except where unable to exercise those privileges which cannot be granted due to relevant federal, state or territory legislation:
                <ul>
                    <li>Be elected into a formal position within the party;</li>
                    <li>Stand as a candidate in elections;</li>
                    <li>Communicate and submit policy and constitutional amendment proposals;</li>
                    <li>Participate in the decision making process;</li>
                    <li>Vote at Party Meetings, Congresses and Policy Formulation, Development and Adoption proceedings.</li>
                </ul>
                As a Permanent Resident, you can pay <b>whatever you want</b> to join (even $0!)
            </div>
        </div>)
    }
}
