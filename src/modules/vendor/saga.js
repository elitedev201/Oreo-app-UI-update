import {put, call, takeEvery} from 'redux-saga/effects';
import * as Actions from './constants';

import {getVendor} from './service';

/**
 * Fetch vendor detail saga
 * @returns {IterableIterator<*>}
 */
function* fetchVendorDetailSaga({payload}) {
  try {
    if (payload) {
      const data = yield call(getVendor, payload);
      yield put({type: Actions.FETCH_VENDOR_DETAIL_SUCCESS, data});
    } else {
      yield put({
        type: Actions.FETCH_VENDOR_DETAIL_ERROR,
        error: {
          message: 'No vendor id',
        },
      });
    }
  } catch (e) {
    yield put({type: Actions.FETCH_VENDOR_DETAIL_ERROR, error: e});
  }
}

export default function* vendorSaga() {
  yield takeEvery(Actions.FETCH_VENDOR_DETAIL, fetchVendorDetailSaga);
}
