import React from 'react';

export const Finished = () => (
  <section>
    <h1>Thank you</h1>
    <div>
      <p className="sub-title">{customisation.signupFinishedMessage}</p>
      <p><a href={customisation.signupHomepageLink}>Return home</a></p>
    </div>
  </section>
);

Finished.propTypes = {
  homeUrl: React.PropTypes.string,
};

export default Finished;
