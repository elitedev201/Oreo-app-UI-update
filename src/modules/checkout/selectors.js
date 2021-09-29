import {createSelector} from 'reselect';

export const rootCheckout = state => state.checkout;

export const shippingMethodsSelector = createSelector(rootCheckout, checkout =>
  checkout.get('shipping_methods'),
);

export const shippingMethodsDataSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['shipping_methods', 'data']),
);

export const shippingMethodsLoadingSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['shipping_methods', 'loading']),
);

export const chosenMethodsSelector = createSelector(rootCheckout, checkout =>
  checkout.get('chosen_methods'),
);

export const shippingSelector = createSelector(rootCheckout, checkout =>
  checkout.get('shipping'),
);

export const billingSelector = createSelector(rootCheckout, checkout =>
  checkout.get('billing'),
);
export const paymentMethodSelector = createSelector(rootCheckout, checkout =>
  checkout.get('payment_method'),
);

export const nonceSelector = createSelector(rootCheckout, checkout =>
  checkout.getIn(['update_order', 'nonce']),
);

export const customerNoteSelector = createSelector(rootCheckout, checkout =>
  checkout.get('customer_note'),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutLoadingSelector = createSelector(rootCheckout, checkout =>
  checkout.getIn(['checkout', 'loading']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutRedirectSelector = createSelector(rootCheckout, checkout =>
  checkout.getIn(['checkout', 'redirect']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutResultSelector = createSelector(rootCheckout, checkout =>
  checkout.getIn(['checkout', 'result']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const isDifferentAddressSelector = createSelector(
  rootCheckout,
  checkout => checkout.get('isDifferentAddress'),
);
