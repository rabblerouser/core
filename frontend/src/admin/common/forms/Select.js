import styled from 'styled-components';

const Select = styled.select`
  display: block;
  font-size: 1em;
  background-color: #fff;
  border-color: ${props => props.theme.lightGrey};
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px ${props => props.theme.lightGrey};
  box-sizing: border-box;
  padding: 0.5em;
  width: 100%;

  &:hover {
    border-color: ${props => props.theme.primaryLight};
  }

  &:focus {
    border-color: ${props => props.theme.primaryColour};
    outline: none;
  }

  &:disabled {
    background-color: ${props => props.theme.lightGrey};
    cursor: not-allowed;

    &:hover {
      border: 1px solid ${props => props.theme.lightGrey};
    }
  }
`;
export default Select;
