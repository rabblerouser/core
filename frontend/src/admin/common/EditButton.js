import React from 'react';
import styled from 'styled-components';
import IconButton from './IconButton';

const StyledEditButton = styled(IconButton)`
  &:after {
    content: "\\f040";
    font-family: FontAwesome;
  }
`;

const EditButton = ({ onClick, children }) => (
  <StyledEditButton onClick={onClick} title="Edit">
    {children}
  </StyledEditButton>
);

export default EditButton;
