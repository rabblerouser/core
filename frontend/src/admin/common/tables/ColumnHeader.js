import React from 'react';
import styled from 'styled-components';
import SortButton from './SortButton';

const TH = styled.th`
padding: 0;
&:last-child {
    width: 100px;
}
`;

const ColumnHeader = ({ direction, label, type = 'edit', onClick }) =>
  <TH className={`${type}`} >
    { type !== 'actions' &&
      <SortButton direction={direction} onClick={onClick}>{label}</SortButton>
    }
  </TH>;

export default ColumnHeader;
