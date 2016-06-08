import React from 'react';
import ColumnHeader from './ColumnHeader.jsx';

const Table = ({ columns, data, onClickHeader }) => (
  <table>
    <thead>
      <tr>
      {columns.map(({ label, type, field }, hi) =>
        <ColumnHeader key={`h${hi}`} label={label} type={type} onClick={() => onClickHeader(field)} />)}
      </tr>
    </thead>
    <tbody>
    {data.map((entry, ri) =>
      <tr key={`r${ri}`}>
       {Object.keys(entry).map((key, ci) => <td key={`c${ci}`}>{entry[key]}</td>)}
      </tr>
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
