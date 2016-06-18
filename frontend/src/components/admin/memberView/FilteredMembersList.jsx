import React from 'react';
import MemberListTable from './MemberListTable.jsx';

const FilteredMembersList = ({ groupFilter, members, groups, onSaveMember }) => {
  function filterMembersList() {
    switch (groupFilter) {
      case 'all' :
        return members;
      case 'unassigned' :
        return members.filter(member => member.groups.length === 0);
      default:
        return members.filter(member => member.groups.includes(groupFilter));
    }
  }

  return (
    <MemberListTable members={filterMembersList()} groups={groups} onSaveMember={onSaveMember} />
  );
};

FilteredMembersList.propTypes = {
  groupFilter: React.PropTypes.string,
  members: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveMember: React.PropTypes.func,
};

export default FilteredMembersList;
