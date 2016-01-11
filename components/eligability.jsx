import React, {Component} from 'react';

export default class Eligability extends Component {
    render() {
        return <div id="eligibility-form">
            <div>
                <h1>Eligability</h1>
                <h6>Which of the following options represents your circumstances? (Select one of the four.)</h6>
                <label>
                    <input type="radio" value="enrolled" />
                    I am enrolled to vote in Australia and I am not a member of any other Australian political party.
                </label>
                <label>
                    <input type="radio" value="resident" />
                    I am a permanent resident in Australia and I am not a member of any other Australian political party.
                </label>
                <label>
                    <input type="radio" value="member" />
                    I am a member of at least one other Australian political party and I wish to support the Pirate Party.
                </label>
                <label>
                    <input type="radio" value="international" />
                    I do not live in Australia and wish to be an international supporter.
                </label>
            </div>
        </div>
    }
}
