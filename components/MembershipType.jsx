import React, {Component} from 'react';
import InfoBox from './InfoBox.jsx';

export default class MembershipType extends Component {
    constructor(props) {
        super(props);
        this.showInfoBox = this.showInfoBox.bind(this);
        this.state = {
            showInfoBox: false
         };
    }

    showInfoBox() {
        if(this.refs.isEnrolledYes) {
            this.setState( { showInfoBox: true } );
        }
    }

    render() {
        return (<fieldset>
            <h1 className="form-title">Membership Type</h1>
            <div className="form-body">
                <div className="heading">
                    <h2 className="sub-title">Answer the following questions</h2>
                    <div className="sub-description">We will use your answers to determine which Pirate Party membership suits you best.</div>
                </div>
                <div className="field-group">
                    <h3>Are you enrolled to vote in Australia?</h3>
                    <label htmlFor="yes" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} type="radio" name="isEnrolled" className="isEnrolled" ref="isEnrolledYes" id="Yes" value="Yes" />
                        Yes
                    </label>
                    <label htmlFor="no" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} type="radio" name="isEnrolled" className="isEnrolled" ref="isEnrolledNo" id="No" value="No" />
                        No
                    </label>
                </div>
                <div className="field-group">
                    <h3>Which of these applies to you?</h3>
                    <label htmlFor="citizen" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} value="I am an Australian citizen." type="radio" name="residentialStatus" className="residentialStatus" ref="citizen" id="citizen" />
                        I am an Australian citizen.
                    </label>
                    <label htmlFor="permanentResident" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} defaultChecked="" value="I have a Permanent Resident visa." type="radio" name="residentialStatus" className="residentialStatus" ref="permanentResident" id="permanentResident" />
                        I have a Permanent Resident visa.
                    </label>
                    <label htmlFor="internationalCitizen" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} defaultChecked="" value="I am an international citizen or have a Temporary visa." type="radio" name="residentialStatus" className="residentialStatus" ref="internationalCitizen" id="internationalCitizen" />
                        I am an international citizen or have a Temporary visa.
                    </label>
                </div>
                <div className="field-group">
                    <h3>Are you a member of another Australian political party?</h3>
                    <label htmlFor="yesOp" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} value="Yes" defaultChecked="" type="radio" name="isMemberOfOtherParty" className="isMemberOfOtherParty" ref="yes" id="yesOp" />
                        Yes
                    </label>
                    <label htmlFor="noOp" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} value="No" defaultChecked="" type="radio" name="isMemberOfOtherParty" className="isMemberOfOtherParty" ref="no" id="noOp" />
                        No
                    </label>
                </div>
                {(() => {
                    if (this.state.showInfoBox) {
                       return <InfoBox />;
                    }
                })()}
                <div className="navigation">
                    <button onClick={this.props.nextStep}>Continue</button>
                </div>
            </div>
        </fieldset>)
    }
}
