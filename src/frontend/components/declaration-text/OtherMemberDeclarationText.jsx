import React, {Component} from 'react';

export default class OtherMemberDeclarationText extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return  <div className="declaration-text">
                    <p>I wish to become a member of Pirate Party Australia.
                        I have read and understand the <b><a href="https://pirateparty.org.au/constitution/" target="_blank">Pirate   Party Australia Constitution</a> </b> 
                         and agree with its platform and principles,
                        and will to the best of my ability work to uphold and promote them.
                    </p>
                </div>;
    }
}
