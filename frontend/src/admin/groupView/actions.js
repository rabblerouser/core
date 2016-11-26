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

export const GROUP_REMOVED = 'GROUP_REMOVED';
export const groupRemoved = groupId => ({
  type: GROUP_REMOVED,
  payload: { groupId },
});

export const GROUP_UPDATED = 'GROUP_UPDATED';
export const groupUpdated = group => ({
  type: GROUP_UPDATED,
  payload: { group },
});

export const GROUP_CREATED = 'GROUP_CREATED';
export const groupCreated = group => ({
  type: GROUP_CREATED,
  payload: { group },
});
