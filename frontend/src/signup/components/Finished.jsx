import React from 'react';
import { urls } from '../strings';

export const Finished = ({ homeUrl = urls.homePage }) => (
  <section id="finished">
    <header>
      <h1 className="form-title">Finish</h1>
    </header>
    <div className="form-body">
      <div className="heading">
        <h2 className="sub-title"> Thank you, we have received your details. </h2>
      </div>
      {
        homeUrl && <div className="navigation"><p><a href={homeUrl}>Return home</a></p></div>
      }
    </div>
  </section>
);

Finished.propTypes = {
  homeUrl: React.PropTypes.string,
};

export default Finished;
