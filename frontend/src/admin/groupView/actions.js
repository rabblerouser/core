export const GROUPS_LIST_UPDATED = 'GROUPS_LIST_UPDATED';

export const groupsListUpdated = groups => ({
  type: GROUPS_LIST_UPDATED,
  payload: { groups },
});
