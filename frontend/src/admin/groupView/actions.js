export const GROUPS_LIST_UPDATED = 'GROUPS_LIST_UPDATED';

export const groupsListUpdated = groups => ({
  type: GROUPS_LIST_UPDATED,
  payload: { groups },
});

export const GROUP_SELECTED = 'GROUP_SELECTED';

export const groupSelected = groupId => ({
  type: GROUP_SELECTED,
  payload: { groupId },
});
