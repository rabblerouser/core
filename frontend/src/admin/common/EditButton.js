import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledEditButton = styled(Button)`
  border: 1px solid;
  &:after {
    content: "\f040";
    font-family: FontAwesome;
  }
  span {
      display: none;
  }
}
`;

const EditButton = ({ onClick, title = 'Edit', children }) => (
  <StyledEditButton onClick={onClick} className="edit" title={title}>
    {children}
  </StyledEditButton>
);

export default EditButton;
