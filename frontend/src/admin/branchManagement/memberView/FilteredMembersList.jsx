import React from 'react';
import { connect } from 'react-redux';
import MemberListTable from './MemberListTable';
import { getSelectedGroupId } from '../groupView';
import { getMembers } from './reducers';

const FilteredMembersList = ({ groupFilter, members }) => {
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
  return members.length === 0 ?
    <aside className="no-entries">No entries found</aside>
  : <MemberListTable members={filterMembersList()} />;
};

const mapStateToProps = state => ({
  members: getMembers(state),
  groupFilter: getSelectedGroupId(state),
});

export default connect(mapStateToProps)(FilteredMembersList);
