import request from 'src/utils/fetch';
import queryString from 'query-string';
import {PLUGIN_NAME} from 'src/config/development';

/**
 * Fetch category data
 * @returns {*}
 */
export const getCategories = query =>
  request.get(
    `/${PLUGIN_NAME}/v1/categories?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );
