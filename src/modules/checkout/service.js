import request from 'src/utils/fetch';
import queryString from 'query-string';
import {PLUGIN_NAME} from 'src/config/development';

/**
 * Get shipping method
 */
export const getShippingMethods = () =>
  request.get(`/${PLUGIN_NAME}/v1/shipping-methods`);

/**
 * Update order Review
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const updateOrderReview = data =>
  request.post(`/${PLUGIN_NAME}/v1/update-order-review`, data);

/**
 * Checkout API
 * @param nonce
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const checkout = (nonce, data) =>
  request.post(
    `/${PLUGIN_NAME}/v1/checkout?woocommerce-process-checkout-nonce=${nonce}`,
    queryString.stringify(data),
  );
