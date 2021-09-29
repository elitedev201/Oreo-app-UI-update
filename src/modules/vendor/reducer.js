import {fromJS} from 'immutable';

import * as Actions from './constants';

const initState = fromJS({
  data: {},
  loading: false,
  isLoadingReview: false,
});

export default function vendorReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_VENDOR_DETAIL:
      return state.set('data', fromJS({})).set('loading', true);
    case Actions.FETCH_VENDOR_DETAIL_SUCCESS:
      return state.set('data', fromJS(action.data)).set('loading', false);
    case Actions.FETCH_VENDOR_DETAIL_ERROR:
      return state.set('data', fromJS({})).set('loading', false);
    case Actions.SET_LOADING_REVIEW:
      return state.set('isLoadingReview', true);
    default:
      return state;
  }
}
