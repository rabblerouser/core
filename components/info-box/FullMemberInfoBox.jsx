import React, {Component} from 'react';
import MembershipTypeExplanation from './MembershipTypeExplanation.jsx';

export default class FullMemberInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.props.didUpdate(true);
    }

    render() {
        return (<div className="info-box">
            <div className="info-heading">
                <h3>You are entitled to a Full Membership. </h3>
                <MembershipTypeExplanation />
            </div>
            <div className="info-body">
                As an Australian citizen with no other political party, you are entitled to be a Full Member. As such, you can:
                <ul>
                    <li>Be elected into a formal position within the party;</li>
                    <li>Stand as a candidate in elections;</li>
                    <li>Communicate and submit policy and constitutional amendment proposals;</li>
                    <li>Participate in the decision making process;</li>
                    <li>Vote at Party Meetings, Congresses and Policy Formulation, Development and Adoption proceedings.</li>
                </ul>
                As a Full Member, you can pay <b>whatever you want</b> to join (even $0!)
            </div>
        </div>)
    }
}
