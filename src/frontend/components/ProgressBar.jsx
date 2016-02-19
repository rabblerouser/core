import React, {Component} from 'react';

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.getClass = this.getClass.bind(this);
    }

    getClass(progress_step) {
      if (progress_step < this.props.progress)
        return "visited";
      else if (progress_step === this.props.progress)
        return "active";
      else {
        return "unvisited";
      }
    }

    render() {
       return <div className="header">
                 <img src="/images/logo.svg" />
                 <ul className="progress-bar">
                     <li className={this.getClass(1)} id="progress-details">Details<br/><br/><br/></li>
                     <li className={this.getClass(2)} id="progress-confirm">Confirm<br/><br/><br/></li>
                     <li className={this.getClass(3)} id="progress-finished">Finish<br/><br/><br/></li>
                 </ul>
             </div>
    }
}
