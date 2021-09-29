import request from 'src/utils/fetch';
import queryString from 'query-string';
import {VENDOR, PLUGIN_NAME} from 'src/config/development';
/**
 * Fetch vendor data
 * @returns {*}
 */

export const getVendor = vendor_id => {
  if (VENDOR === 'wcfm') {
    return request.get(`/${PLUGIN_NAME}/v1/vendor/${vendor_id}`);
  }
  return request.get(`/dokan/v1/stores/${vendor_id}`);
};

/**
 * Fetch list vendor
 * @returns {*}
 */

export const getVendors = (query, options = {}) => {
  if (VENDOR === 'wcfm') {
    return request.get(
      `/${PLUGIN_NAME}/v1/vendors?${queryString.stringify(query, {
        arrayFormat: 'comma',
      })}`,
      options,
    );
  }
  return request.get(
    `/dokan/v1/stores?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
    options,
  );
};

/**
 * Fetch review by vendor id
 * @returns {*}
 */

export const getReviewByVendorId = (vendor_id, query) => {
  return request.get(
    `dokan/v1/stores/${vendor_id}/reviews?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );
};

/**
 * Send contact for vendor
 * @returns {*}
 */

export const sendContactVendorId = (vendor_id, data) =>
  request.post(`/dokan/v1/stores/${vendor_id}/contact`, data);

/**
 * Send review for vendor id
 * @returns {*}
 */

export const sendReviewVendorId = (vendor_id, data) =>
  request.post(`/dokan/v1/stores/${vendor_id}/reviews`, data);
