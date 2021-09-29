import {fromJS} from 'immutable';

import {REHYDRATE} from 'redux-persist/lib/constants';

import * as Actions from './constants';

import {SIGN_OUT_SUCCESS} from 'src/modules/auth/constants';

export const initState = fromJS({
  cart_key: null,
  cart_data: {
    items: {},
    totals: {},
    coupons: [],
  },
  cart_loading: false,
  cart_list_loading: false,
  cart_remove_loading: false,
  cart_update_loading: false,
  cart_update_add_coupon_loading: false,
  cart_update_delete_coupon_loading: false,
});

function cartReducer(state = initState, {type, payload}) {
  switch (type) {
    case SIGN_OUT_SUCCESS:
    case Actions.CLEAR_CART:
      return initState;
    case Actions.GET_CART:
      if (!state.get('cart_data').items && payload) {
        return state.set('cart_loading', true);
      }
      return state;
    case Actions.GET_CART_SUCCESS:
      return state
        .set('cart_data', fromJS(payload))
        .set('cart_loading', false)
        .set('cart_list_loading', false)
        .set('cart_remove_loading', false)
        .set('cart_update_loading', false)
        .set('cart_update_add_coupon_loading', false)
        .set('cart_update_delete_coupon_loading', false);
    case Actions.GET_CART_ERROR:
      return state
        .set('cart_loading', false)
        .set('cart_remove_loading', false)
        .set('cart_update_loading', false);
    case Actions.ADD_TO_CART_SUCCESS:
      return state.set('cart_key', payload);
    case Actions.ADD_LIST_CART:
      return state.set('cart_list_loading', true);
    case Actions.ADD_LIST_CART_SUCCESS:
    case Actions.ADD_LIST_CART_ERROR:
      return state.set('cart_list_loading', false);
    case Actions.REMOVE_FROM_CART:
      return state.set('cart_remove_loading', true);
    case Actions.REMOVE_FROM_CART_ERROR:
      return state.set('cart_remove_loading', false);
    case Actions.UPDATE_QUANTITY_CART:
      return state.set('cart_update_loading', true);
    case Actions.UPDATE_QUANTITY_CART_ERROR:
      return state.set('cart_update_loading', false);
    case Actions.ADD_COUPON:
      return state.set('cart_update_add_coupon_loading', true);
    case Actions.REMOVE_COUPON:
      return state.set('cart_update_delete_coupon_loading', true);
    case Actions.ADD_COUPON_SUCCESS:
    case Actions.ADD_COUPON_ERROR:
      return state.set('cart_update_add_coupon_loading', false);
    case Actions.REMOVE_COUPON_SUCCESS:
    case Actions.REMOVE_COUPON_ERROR:
      return state.set('cart_update_delete_coupon_loading', false);
    case REHYDRATE:
      if (payload?.cart) {
        return initState.merge(
          fromJS({
            cart_key: payload?.cart?.get('cart_key'),
            cart_data: payload?.cart?.get('cart_data'),
          }),
        );
      } else {
        return initState;
      }
    default:
      return state;
  }
}

export default cartReducer;
