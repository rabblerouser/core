import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledDeleteButton = styled(Button)`
  &:after {
    content: "\f1f8";
    font-family: FontAwesome;
  }
  span {
      display: none;
  }
`;

const DeleteButton = ({ confirmMessage, onDelete, title }) => {
  const onClick = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  return (
    <StyledDeleteButton onClick={onClick} className="delete" title={title}>
      <span>{title}</span>
    </StyledDeleteButton>
  );
};

export default DeleteButton;
