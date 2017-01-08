import { isValidElement } from 'react';
import { connect } from 'react-redux';
import { getUserType } from '../reducers/userReducers';

export const RestrictedTo = ({ type, userType, children }) => (
 isValidElement(children) && (type === userType) ? children : null
);

export default connect(state => ({ userType: getUserType(state) }))(RestrictedTo);
