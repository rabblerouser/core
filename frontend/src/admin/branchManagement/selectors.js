import { getBranchManagement } from '../reducers/rootSelectors';

export const getAdminsView = state => getBranchManagement(state).admins;
export const getBranchView = state => getBranchManagement(state).branch;
export const getGroupsView = state => getBranchManagement(state).groups;
export const getMembersView = state => getBranchManagement(state).members;
