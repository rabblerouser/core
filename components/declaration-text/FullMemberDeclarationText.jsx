import React, {Component} from 'react';

export default class FullMemberDeclarationText extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return   <div className="declaration-text">
            <p>I wish to become a member of Pirate Party Australia. I have read and understand the <b><a href="#">Pirate Party
            Australia Constitution</a></b> and agree with its platform and principles, and will to the best of my
            ability work to uphold and promote them. </p>

            <p>I am enrolled for Federal elections, i.e. I am 16 years of age or older. I am an Australian
            citizen (or a British citizen who was on the Australian Electoral roll on 25 of January 1984)
            and I have lived at the above address for at least one month.</p>

            <p>I consent to this form being forwarded to the Australia Electoral Commission (AEC) in support of
            the party’s application for registration as a political party.</p>

            <b><a href="#">If you are not enrolled to vote, click here.</a></b>

          </div>
    }
}
