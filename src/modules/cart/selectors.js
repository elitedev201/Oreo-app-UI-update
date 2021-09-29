import {createSelector} from 'reselect';
import {fromJS} from 'immutable';

export const rootCart = state => state.cart;

/**
 * Cart selector
 * @package rn_food
 * @since 1.0.0
 */
export const cartSelector = createSelector(
  rootCart,
  cart => cart.getIn(['cart_data', 'items']) || fromJS({}),
);

/**
 * Cart total selector
 * @package rn_oreo
 * @since 1.0.0
 */
export const cartTotalSelector = createSelector(
  rootCart,
  cart => cart.getIn(['cart_data', 'totals']) || fromJS({}),
);

/**
 * Cart key selector
 * @package rn_oreo
 * @since 1.0.0
 */
export const cartKeySelector = createSelector(rootCart, cart =>
  cart.get('cart_key'),
);

/**
 * Count item in cart
 */
export const countItemSelector = createSelector(cartSelector, items =>
  items.reduce((total, item) => {
    const quantity =
      item.get('quantity') && parseInt(item.get('quantity')) > 0
        ? parseInt(item.get('quantity'))
        : 0;
    return quantity + total;
  }, 0),
);

/**
 * Loading cart
 */
export const loadingItemSelector = createSelector(rootCart, data =>
  data.get('cart_loading'),
);

/**
 * Loading list cart
 */
export const loadingListSelector = createSelector(rootCart, data =>
  data.get('cart_list_loading'),
);

/**
 * Loading remove cart
 */
export const loadingRemoveItemSelector = createSelector(rootCart, data =>
  data.get('cart_remove_loading'),
);

/**
 * Loading update quantity cart
 */
export const loadingUpdateQuantitySelector = createSelector(rootCart, data =>
  data.get('cart_update_loading'),
);

/**
 * Cart coupons applied selector
 * @package rn_oreo
 * @since 1.0.0
 */
export const couponsAppliedSelector = createSelector(
  rootCart,
  cart => cart?.getIn(['cart_data', 'coupons'])?.toJS() || [],
);

/**
 * Cart coupons add loading selector
 * @package rn_oreo
 * @since 1.0.0
 */
export const couponsAddLoadingSelector = createSelector(rootCart, cart =>
  cart.get('cart_update_add_coupon_loading'),
);

/**
 * Cart coupons delete loading selector
 * @package rn_oreo
 * @since 1.0.0
 */
export const couponsDeleteLoadingSelector = createSelector(rootCart, cart =>
  cart.get('cart_update_delete_coupon_loading'),
);
