import styled from 'styled-components';
import { SORT } from './sortColumn';

const downChevron = '"\\f0dd"';
const upChevron = '"\\f0de"';

export const SortButton = styled.button`
  text-align: left;
  position: relative;
  border: none;
  width: 100%;
  &:hover {
      background: ${props => props.theme.lightGrey};
      cursor: pointer;
      color: ${props => props.theme.black};
      &::after {
        content: ${props => (props.direction !== SORT.asc ? downChevron : upChevron)};
        font-family: FontAwesome;
        position: absolute;
        right: 5px;
      }
  }

  background-color: ${props => props.theme.white};
  color: ${props => props.theme.primaryDark};
  margin: 0px;
  word-wrap: break-word;
  font-size: 1em;
`;

export default SortButton;
