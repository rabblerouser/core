import React from 'react';
import ColumnHeader from './ColumnHeader';

const Table = ({ columns, data, onClickHeader }) => (
  <table>
    <thead>
      <tr>
        {columns.map(({ label, type, field }, i) =>
          <ColumnHeader key={i} label={label} type={type} onClick={() => onClickHeader(field)} />)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) =>
        <tr key={i}>
          {Object.keys(row).map((col, j) => <td key={j}>{row[col]}</td>)}
        </tr>,
    )}
    </tbody>
  </table>
);

export default Table;

Table.propTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  onClickHeader: React.PropTypes.func,
};
