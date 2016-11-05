import { getModal } from './rootSelectors';

import {
  MODAL_OPENED,
  MODAL_CLOSED,
} from '../actions';

const initialState = {
  isModalOpen: false,
  source: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_OPENED: return {
      ...state,
      isModalOpen: true,
      source: action.source,
    };
    case MODAL_CLOSED: return {
      ...state,
      isModalOpen: false,
      source: '',
    };
    default : return state;
  }
};

export const getIsModalOpen = (state, source) => getModal(state).isModalOpen && getModal(state).source === source;
