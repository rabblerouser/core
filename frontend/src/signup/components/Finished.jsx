import React from 'react';

export const Finished = () => (
  <section>
    <h1>Thank you</h1>
    <div>
      <h2>{customisation.signupFinishedMessage}</h2>
      <p><a href={customisation.signupHomepageLink}>Return home</a></p>
    </div>
  </section>
);

export default Finished;
