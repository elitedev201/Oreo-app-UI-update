import queryString from 'query-string';
import pickBy from 'lodash/pickBy';
import request from 'src/utils/fetch';
import {PLUGIN_NAME} from 'src/config/development';
/**
 * Add to cart
 * @param data Cart data { product_id: Number, quantity: Number, variation_id: Number, variation: Array, cart_item_data: Object | Array }
 * @package rn_oreo
 * @since 1.0.0
 * @version 1.0.0
 * @returns {Promise | Promise<unknown>}
 */
export const addToCart = (data, cartKey) => {
  if (cartKey) {
    return request.post(`/${PLUGIN_NAME}/v1/cart?cart_key=${cartKey}`, data);
  }
  return request.post(`/${PLUGIN_NAME}/v1/cart`, data);
};

export const removeCartItem = (data, cartKey) =>
  request.post(`/${PLUGIN_NAME}/v1/remove-cart-item?cart_key=${cartKey}`, data);

export const updateCartQuantity = (data, cartKey) =>
  request.post(`/${PLUGIN_NAME}/v1/set-quantity?cart_key=${cartKey}`, data);

/**
 * Get list cart
 * @package rn_oreo
 * @since 1.0.0
 * @version 1.0.0
 * @returns {Promise | Promise<unknown>}
 */
export const getCart = (query, options = {}) =>
  request.get(
    `/${PLUGIN_NAME}/v1/cart?${queryString.stringify(
      pickBy(query, item => item !== ''),
      {arrayFormat: 'comma'},
    )}`,
    options,
  );

export const addCoupon = (data, cartKey) =>
  request.post(`/${PLUGIN_NAME}/v1/add-discount?cart_key=${cartKey}`, data);

export const removeCoupon = (data, cartKey) =>
  request.post(`/${PLUGIN_NAME}/v1/remove-coupon?cart_key=${cartKey}`, data);
