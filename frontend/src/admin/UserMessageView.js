import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const ListItem = styled.li`
  border-radius: 3px;
  padding: 10px;
  margin: 20px auto;
  list-style: none;
  color: white;
`;

const SuccessEntry = styled(ListItem)`
  background-color: ${props => props.theme.success};
`;

const ErrorEntry = styled(ListItem)`
  background-color: ${props => props.theme.error};
`;

const UserMessageView = ({ successMessages, failureMessages }) => (
  <ul>
    {failureMessages.map(entry => <ErrorEntry key={entry}>{entry}</ErrorEntry>)}
    {successMessages.map(entry => <SuccessEntry key={entry}>{entry}</SuccessEntry>)}
  </ul>
);

const mapStateToProps = ({ appFeedback }) => ({
  successMessages: appFeedback.successMessages,
  failureMessages: appFeedback.failureMessages,
});

export default connect(mapStateToProps)(UserMessageView);
