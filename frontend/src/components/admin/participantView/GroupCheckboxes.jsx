import React from 'react';

const GroupCheckboxes = ({ participantGroups, groupOptions, onChange }) => {
  const isSelected = testGroup => participantGroups.includes(testGroup.id);

  const groupOptionInputs = groupOptions.map(group => (
    <div>
      <input
        type="checkbox"
        id={group.id}
        onChange={onChange}
        defaultChecked={isSelected(group)}
        value={group.id}
      />
      <label htmlFor={group.id} key={group.id}>{group.name}</label>
    </div>
  ));

  return (
    <fieldset className="selectGroups">
      {groupOptionInputs}
    </fieldset>
  );
};

GroupCheckboxes.propTypes = {
  participantGroups: React.PropTypes.array,
  groupOptions: React.PropTypes.array,
  onChange: React.PropTypes.func,
};

export default GroupCheckboxes;
