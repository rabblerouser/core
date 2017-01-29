import styled from 'styled-components';

const A = styled.a`
  color: ${props => props.theme.primaryColour};
  &:hover,
  &:focus {
    color: ${props => props.theme.black};
  }
`;

export default A;
