import React from 'react';

const ColumnHeader = ({ label, type = 'edit', onClick }) =>
  <th className={`${type}`} onClick={onClick}>{label}</th>;

export default ColumnHeader;
