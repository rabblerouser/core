import styled from 'styled-components';

export default styled.button`
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
/*
button {
    background: none;
    color: #0073ae;
    padding: 0;
    margin: 0;
    border: 0;
    font-size: 1.3em;
    padding: 5px;
    display: inline;
    margin-right: 15px;
}


button:hover {
    background: #062C40;
    color: #fff;
}
*/
