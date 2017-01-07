import React from 'react';
import styled from 'styled-components';

import ColumnHeader from './ColumnHeader';

export const Table = styled.table`
  table-layout: fixed;
  margin-top: 0;
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  @media (min-width:0px) and (max-width:479px) {
    display: none;
  }
`;
const TBody = styled.tbody`
  border-top-style: solid;
  border-bottom-style: solid;
  border-width: 1px;
  border-color: ${props => props.theme.lightGrey};
`;

const TR = styled.tr`
  vertical-align: middle;
  border: none;
`;

export const BodyRow = styled(TR)`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.lightGrey};
`;

const TD = styled.td`
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  word-wrap: break-word;
  font-size: 14px;
  vertical-align: top;
  @media (min-width:0px) and (max-width:479px) {
      display: block;
      padding: 0 10px;
  }
  &:last-child {
      white-space: pre;
      overflow: visible;
      padding-right: 10px;
  }
`;

const StyledTable = ({ columns, data, onClickHeader }) => (
  <Table>
    <THead>
      <TR>
        {columns.map(({ label, type, field }, i) =>
          <ColumnHeader key={i} label={label} type={type} onClick={() => onClickHeader(field)} />)}
      </TR>
    </THead>
    <TBody>
      {data.map((row, i) =>
        <BodyRow key={i}>
          {Object.keys(row).map((col, j) => <TD key={j}>{row[col]}</TD>)}
        </BodyRow>,
    )}
    </TBody>
  </Table>
);

export default StyledTable;
