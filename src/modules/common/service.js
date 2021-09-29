import request from 'src/utils/fetch';
import {PLUGIN_NAME} from 'src/config/development';
export const fetchSetting = () => request.get(`/${PLUGIN_NAME}/v1/settings`);
export const fetchConfig = () => request.get(`/${PLUGIN_NAME}/v1/configs`);
export const fetchTemplate = () =>
  request.get(`/${PLUGIN_NAME}/v1/template-mobile`);
export const fetchCountries = () => request.get('/wc/v3/data/countries');
export const fetchPaymentGateways = () =>
  request.get('/wc/v3/payment_gateways');
