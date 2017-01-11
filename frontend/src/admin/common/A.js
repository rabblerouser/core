import styled from 'styled-components';

export default styled.a`
  color: ${props => props.theme.primaryColour};
  &:hover,
  &:focus {
    color: ${props => props.theme.black};
  }
`;
