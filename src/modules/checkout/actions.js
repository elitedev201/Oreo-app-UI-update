import * as Actions from './constants';

/**
 * Get shipping methods
 * @returns {{type: string}}
 */
export function getShippingMethods() {
  return {
    type: Actions.GET_SHIPPING_METHODS,
  };
}

/**
 * Change chosen method
 * @returns {{type: string, payload: {key: *, value: *}}}
 */
export function changeChosenMethod(key, value) {
  return {
    type: Actions.CHANGE_CHOSEN_METHOD,
    payload: {key, value},
  };
}

/**
 * Change chosen method
 * @returns {{type: string, payload: *}}
 */
export function updateAddress(data) {
  return {
    type: Actions.UPDATE_ADDRESS,
    payload: data,
  };
}

/**
 * Change chosen method
 * @returns {{type: string, payload: *}}
 */
export function changeCustomerNote(value) {
  return {
    type: Actions.CHANGE_CUSTOMER_NOTE,
    payload: value,
  };
}

/**
 * Select payment method
 * @returns {{type: string, payload: *}}
 */
export function selectPaymentMethod(data) {
  return {
    type: Actions.SELECT_PAYMENT_METHOD,
    payload: data,
  };
}

/**
 * Update order review
 * @param cb call back function
 * @returns {{payload: *, type: string}}
 */
export function updateOrderReview(cb) {
  return {
    type: Actions.UPDATE_ORDER_REVIEW,
    payload: {
      cb,
    },
  };
}

/**
 * Progress checkout
 * @returns {{payload: {data: {}, none: string}, type: string}}
 */
export function checkout(cb, data: {}) {
  return {
    type: Actions.CHECKOUT,
    payload: {cb, data},
  };
}

/**
 * Progress checkout
 * @returns {{payload: {data: {}, none: string}, type: string}}
 */
export function changeIsDifferentAddress(value) {
  return {
    type: Actions.CHANGE_DIFFERENT_ADDRESS,
    payload: value,
  };
}
