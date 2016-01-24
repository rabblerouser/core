import React, {Component} from 'react';
import FullMemberInfoBox from './FullMemberInfoBox.jsx';
import PermanentResidentInfoBox from './PermanentResidentInfoBox.jsx';
import SupporterInfoBox from './SupporterInfoBox.jsx';
import InternationalSupporterInfoBox from './InternationalInfoBox.jsx';
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
