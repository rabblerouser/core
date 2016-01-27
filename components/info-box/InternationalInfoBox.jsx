import React, {Component} from 'react';

export default class InternationalInfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }
    render() {
        return <div className="info-box">
            <div className="info-heading">
                <h3>You are entitled to an International Membership.</h3>
                <a href="https://pirateparty.org.au/constitution/#4.2"><span className="circled">?</span>  What are the different membership types?</a>
            </div>
            <div className="info-body">
                International members are not eligible to vote, but they can:
                <ul>
                    <li>Participate in the decision making process;</li>
                    <li>Communicate and submit policy and constitutional amendment proposals.</li>
                </ul>
                As an International Member, you can pay whatever you want to join (even $0!)
            </div>
        </div>
    }
}
