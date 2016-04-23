import React from 'react';

export default ({ onDelete, lab }) => {
  const deleteLab = () => {
    if (confirm('Are you sure you want to delete the current lab?')) {
      onDelete(lab);
    }
  };

  return <button onClick={deleteLab} className="delete" title="Delete lab"><span>Delete lab</span></button>;
};
