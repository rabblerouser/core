import React, {Component} from 'react';

export default class FullMemberInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }
    render() {
        return <div className="info-box">
            <div className="info-heading">
                <h3>You are entitled to a Full Membership. </h3>
                <a href="https://pirateparty.org.au/constitution/#4.2"><span className="circled">?</span>  What are the different membership types?</a>
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
                As a Full Member, you can pay whatever you want to join (even $0!)
            </div>
        </div>
    }
}
