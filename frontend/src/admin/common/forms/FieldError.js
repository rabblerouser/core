import React from 'react';
import styled from 'styled-components';

const ErrorText = styled.span`
  color: ${props => props.theme.error};
  font-weight: lighter;
  font-size: small;
  padding-left: 10px;
`;

const FieldError = ({ error }) => <ErrorText>{error}</ErrorText>;

export default FieldError;
