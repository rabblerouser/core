import React from 'react';
import styled from 'styled-components';
import IconButton from './IconButton';

const StyledAddButton = styled(IconButton)`
  &::after {
    content: "\\f067";
    font-family: FontAwesome;
  }
`;

const AddButton = ({ onClick, children }) => (
  <StyledAddButton onClick={onClick} title="Add">
    {children}
  </StyledAddButton>
);

export default AddButton;
