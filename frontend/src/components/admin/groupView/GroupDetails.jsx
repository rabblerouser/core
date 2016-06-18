import React from 'react';

const Group = ({ group }) => (
  <div>
    <p>
      {group.description}
    </p>
  </div>
);

Group.propTypes = {
  group: React.PropTypes.object.isRequired,
};

export default Group;
