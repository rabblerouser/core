import React from 'react';

const UserMessageView = props => (
  <section className="admin-section" id="user-messages">
    <ul>
      {props.errors.map(entry => <li key={entry} className="error">{entry}</li>)}
      {props.messages.map(entry => <li key={entry}>{entry}</li>)}
    </ul>
  </section>
);

UserMessageView.propTypes = {
  messages: React.PropTypes.array,
  errors: React.PropTypes.array,
};

export default UserMessageView;
