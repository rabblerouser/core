import React from 'react';
import styled from 'styled-components';
import IconButton from './IconButton';

const StyledDeleteButton = styled(IconButton)`
  &::after {
    content: "\\f1f8";
    font-family: FontAwesome;
  }
`;

const DeleteButton = ({ confirmMessage, onDelete, children }) => {
  const onClick = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  return (
    <StyledDeleteButton onClick={onClick} title="Delete">
      {children}
    </StyledDeleteButton>
  );
};

export default DeleteButton;
