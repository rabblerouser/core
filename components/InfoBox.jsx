import React, {Component} from 'react';
import FullMemberInfoBox from './info-box/FullMemberInfoBox.jsx';
import PermanentResidentInfoBox from './info-box/PermanentResidentInfoBox.jsx';
import SupporterInfoBox from './info-box/SupporterInfoBox.jsx';
import InternationalSupporterInfoBox from './info-box/InternationalSupporterInfoBox.jsx';
export default class InfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    render() {
      if(this.props.membershipType === 'full') {
          return <FullMemberInfoBox />;
      }
      if(this.props.membershipType === 'permanentResident') {
          return <PermanentResidentInfoBox />;
      }
      if(this.props.membershipType === 'supporter') {
          return <SupporterInfoBox />;
      }
      if(this.props.membershipType === 'internationalSupporter') {
          return <InternationalSupporterInfoBox />;
      }
    }
}
