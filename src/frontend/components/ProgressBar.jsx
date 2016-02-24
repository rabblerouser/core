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
                 <img src ='/images/the_lab_logo.svg'/>
             </div>
    }
}
