import styled from 'styled-components';

const Button = styled.button`
  border: 1px solid;
  border-radius: 4px;
  border-color: ${props => props.theme.white};
  font-size: 20px;
  background-color: ${props => props.theme.primaryColour};
  color: ${props => props.theme.white};
  &:hover,
  &:focus {
    background-color: ${props => props.theme.black};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    &:hover {
      background-color: ${props => props.theme.primaryColour};
    }
  }
`;

export default Button;
