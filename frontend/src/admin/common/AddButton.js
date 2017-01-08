import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const StyledAddButton = styled(Button)`
  border: 1px solid;
  margin-left: 10px;
  margin-top: 3px;
  &:after {
    content: "\f067";
    font-family: FontAwesome;
  }
  span {
      display: none;
  }
}
`;

const AddButton = ({ onClick, title = 'Add', children }) => (
  <StyledAddButton onClick={onClick} className="new" title={title}>
    {children}
  </StyledAddButton>
);

export default AddButton;
