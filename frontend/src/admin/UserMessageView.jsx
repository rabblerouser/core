import React from 'react';
import { connect } from 'react-redux';

const UserMessageView = ({ successMessages, failureMessages }) => (
  <section className="admin-section" id="user-messages">
    <ul>
      {failureMessages.map(entry => <li key={entry} className="error">{entry}</li>)}
      {successMessages.map(entry => <li key={entry}>{entry}</li>)}
    </ul>
  </section>
);

UserMessageView.propTypes = {
  successMessages: React.PropTypes.array,
  failureMessages: React.PropTypes.array,
};

const mapStateToProps = ({ appFeedback }) => ({
  successMessages: appFeedback.successMessages,
  failureMessages: appFeedback.failureMessages,
});

export default connect(mapStateToProps)(UserMessageView);
