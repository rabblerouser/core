import styled from 'styled-components';
import Button from './Button';

export default styled(Button)`
  border: none;
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.primaryColour};
  &:hover,
  &:focus {
    background-color: ${props => props.theme.black};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    &:hover {
      background-color: none;
    }
  }
`;
