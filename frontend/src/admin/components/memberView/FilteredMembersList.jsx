import React from 'react';
import MemberListTable from './MemberListTable';

const FilteredMembersList = ({ groupFilter, members, groups, onSaveMember, onDeleteMember }) => {
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
    <MemberListTable
      members={filterMembersList()}
      groups={groups}
      onSaveMember={onSaveMember}
      onDeleteMember={onDeleteMember}
    />
  );
};

FilteredMembersList.propTypes = {
  groupFilter: React.PropTypes.string,
  members: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveMember: React.PropTypes.func.isRequired,
  onDeleteMember: React.PropTypes.func.isRequired,
};

export default FilteredMembersList;
