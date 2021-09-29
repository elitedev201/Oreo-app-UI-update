import {fromJS} from 'immutable';
import * as Actions from './constants';
import {CLEAR_CART} from 'src/modules/cart/constants';
import {shippingAddressInit, billingAddressInit} from 'src/modules/auth/config';

export const initState = fromJS({
  shipping_methods: {
    loading: false,
    data: [],
    error: null,
  },
  chosen_methods: {},
  payment_method: '',
  customer_note: '',
  isDifferentAddress: false,
  shipping: shippingAddressInit,
  billing: billingAddressInit,
  update_order: {
    loading: false,
    nonce: '',
  },
  checkout: {
    loading: false,
    redirect: '',
    result: '',
  },
});

function checkoutReducer(state = initState, {type, payload, error}) {
  switch (type) {
    case Actions.GET_SHIPPING_METHODS:
      return state.setIn(['shipping_methods', 'loading'], true);

    case Actions.GET_SHIPPING_METHODS_SUCCESS:
      return state
        .set(
          'shipping_methods',
          fromJS({
            data: payload.data,
            loading: false,
            error: null,
          }),
        )
        .set('chosen_methods', fromJS(payload.chosen_methods));
    case Actions.GET_SHIPPING_METHODS_ERROR:
      return state.setIn(['shipping_methods', 'loading'], false);
    case Actions.CHANGE_CHOSEN_METHOD:
      return state.setIn(['chosen_methods', payload.key], payload.value);
    case Actions.CHANGE_CUSTOMER_NOTE:
      return state.set('customer_note', payload);
    case Actions.UPDATE_ADDRESS:
      const shipping = state.get('shipping');
      const billing = state.get('billing');
      const shippingUpdate = payload?.shipping
        ? {
            ...shipping.toJS(),
            ...payload.shipping,
          }
        : shipping.toJS();
      const billingUpdate = payload?.billing
        ? {
            ...billing.toJS(),
            ...payload.billing,
          }
        : billing.toJS();
      return state
        .set('shipping', fromJS(shippingUpdate))
        .set('billing', fromJS(billingUpdate));
    case Actions.SELECT_PAYMENT_METHOD:
      return state.set('payment_method', payload);
    case Actions.CHANGE_DIFFERENT_ADDRESS:
      return state.set('isDifferentAddress', payload);
    case Actions.UPDATE_ORDER_REVIEW:
      return state.setIn(['update_order', 'loading'], true);

    case Actions.UPDATE_ORDER_REVIEW_ERROR:
      return state
        .setIn(['update_order', 'loading'], false)
        .setIn(['update_order', 'error'], error);

    case Actions.UPDATE_ORDER_REVIEW_SUCCESS:
      return state
        .setIn(['update_order', 'loading'], false)
        .setIn(['update_order', 'nonce'], payload.nonce);
    case Actions.CHECKOUT:
      return state.setIn(['checkout', 'loading'], true);

    case Actions.CHECKOUT_ERROR:
      return state
        .setIn(['checkout', 'loading'], false)
        .setIn(['checkout', 'error'], error);

    case Actions.CHECKOUT_SUCCESS:
      return state
        .setIn(['checkout', 'loading'], false)
        .setIn(['checkout', 'result'], payload.result)
        .setIn(['checkout', 'redirect'], payload.redirect);
    case CLEAR_CART:
      return initState;
    default:
      return state;
  }
}

export default checkoutReducer;
