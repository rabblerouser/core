import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FullMemberInfoBox from './FullMemberInfoBox.jsx';
import PermanentResidentInfoBox from './PermanentResidentInfoBox.jsx';
import SupporterInfoBox from './SupporterInfoBox.jsx';
import InternationalSupporterInfoBox from './InternationalInfoBox.jsx';
export default class InfoBox extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate(toTopOfElement) {
        ReactDOM.findDOMNode(this).scrollIntoView(toTopOfElement);
    }

    render() {
      if(this.props.membershipType === 'full') {
          return <FullMemberInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.membershipType === 'permanentResident') {
          return <PermanentResidentInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.membershipType === 'supporter') {
          return <SupporterInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.membershipType === 'internationalSupporter') {
          return <InternationalSupporterInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
    }
}
