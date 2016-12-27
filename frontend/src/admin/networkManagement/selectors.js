import { getNetworkManagement } from '../reducers/rootSelectors';
export const getNetworkAdminsView = state => getNetworkManagement(state).networkAdmins;
