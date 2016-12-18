export const MEMBER_LIST_UPDATED = 'MEMBER_LIST_UPDATED';

export const memberListUpdated = members => ({
  type: MEMBER_LIST_UPDATED,
  payload: { members },
});
