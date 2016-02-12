import React, {Component} from 'react';
import InfoBox from './info-box/InfoBox.jsx';
import Errors from "./Errors.jsx";

export default class MembershipType extends Component {
    constructor(props) {
        super(props);
        this.showInfoBox = this.showInfoBox.bind(this);
        this.allQuestionsAnswered = this.allQuestionsAnswered.bind(this);
        this.calculateMembershipType = this.calculateMembershipType.bind(this);
        this.validateQuestionsAnswered = this.validateQuestionsAnswered.bind(this);
        this.hasAnsweredEnrolledToVote = this.hasAnsweredEnrolledToVote.bind(this);
        this.hasAnsweredCitizenship = this.hasAnsweredCitizenship.bind(this);
        this.hasAnsweredPartyMember = this.hasAnsweredPartyMember.bind(this);

        this.state = {
            showInfoBox: false,
            errors: [],
            membershipType: ""
         };
    }

    calculateMembershipType() {
        const full = "full";
        const permanentResident = "permanentResident";
        const supporter = "supporter";
        const internationalSupporter = "internationalSupporter";
        this.setState({membershipType: "", errors: [], showInfoBox: false});

        if (this.refs.isEnrolledYes.checked) {
            if(this.refs.citizen.checked) {
                if(this.refs.yes.checked) {
                    this.setState({membershipType: supporter, showInfoBox: true});
                } else {
                    this.setState({membershipType: full, showInfoBox: true});
                }
            } else {
                this.setState({errors: ["Only Australian citizens can be enrolled to vote in Australia"],
                              showInfoBox: false});
            }
        }
        else if(this.refs.isEnrolledNo.checked) {
            if(this.refs.citizen.checked) {
                this.setState({errors:["Australian citizens must be enrolled to become a member", "You must be at least 16 years of age to sign up as a Pirate Party member"],
                              showInfoBox: false});
            } else if(this.refs.permanentResident.checked) {
                if(this.refs.yes.checked ) {
                    this.setState({membershipType: supporter, showInfoBox: true});
                } else {
                    this.setState({membershipType: permanentResident, showInfoBox: true});
                }
            } else if(this.refs.internationalCitizen.checked) {
                    this.setState({membershipType: internationalSupporter, showInfoBox: true});
            }
        }
    }

    validateQuestionsAnswered() {
        if(this.allQuestionsAnswered() && this.state.membershipType) {
            this.props.nextStep(this.state.membershipType);
        } else {
          let errors = [];
          if(!this.hasAnsweredEnrolledToVote()) {
            errors.push("Are you enrolled to vote in Australia?");
          }
          if(!this.hasAnsweredCitizenship()) {
            errors.push("Which of these applies to you?");
          }
          if(!this.hasAnsweredPartyMember()) {
            errors.push("Are you a member of another Australian political party?");
          }
          if(errors.length != 0 ){
              this.setState({ errors: errors});
          }
        }
    }

    hasAnsweredEnrolledToVote() {
      return this.refs.isEnrolledYes.checked || this.refs.isEnrolledNo.checked;
    }

    hasAnsweredCitizenship() {
      return this.refs.citizen.checked || this.refs.permanentResident.checked || this.refs.internationalCitizen.checked;
    }

    hasAnsweredPartyMember() {
      return this.refs.yes.checked || this.refs.no.checked ;
    }

    allQuestionsAnswered() {
      return this.hasAnsweredEnrolledToVote() && this.hasAnsweredCitizenship() && this.hasAnsweredPartyMember();
    }

    showInfoBox() {
        if(this.allQuestionsAnswered()) {
            this.calculateMembershipType();
        }
    }

    render() {
        return (<fieldset>
            <h1 className="form-title">Membership Type</h1>
            <div className="form-body">
                <Errors invalidFields={this.state.errors}
                        validationErrorText="Please check the following fields:"/>
                <div className="heading">
                    <h2 className="sub-title">What is your current situation?</h2>
                    <div className="sub-description">We will use your answers to determine which Pirate Party membership suits you best.</div>
                </div>
                <div className="field-group">
                    <h3>Are you enrolled to vote in Australia? <span className="mandatoryField">* </span></h3>
                    <label htmlFor="Yes" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} type="radio" name="isEnrolled" className="isEnrolled" ref="isEnrolledYes" id="Yes" value="Yes" />
                        Yes
                    </label>
                    <label htmlFor="No" onClick={this.showInfoBox}>
                        <input onChange={this.showInfoBox} type="radio" name="isEnrolled" className="isEnrolled" ref="isEnrolledNo" id="No" value="No" />
                        No
                    </label>
                </div>
                <div className="field-group">
                    <h3>Which of these applies to you? <span className="mandatoryField">* </span></h3>
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
                    <h3>Are you a member of any other Australian political party? <span className="mandatoryField">* </span></h3>
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
                       return <InfoBox membershipType={this.state.membershipType}/>;
                    }
                })()}
                <div className="navigation">
                    <button onClick={this.validateQuestionsAnswered}>Continue</button>
                </div>
            </div>
        </fieldset>)
    }
}
