import {put, call, takeEvery, select} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';
import * as Actions from './constants';
import {
  addToCart,
  removeCartItem,
  updateCartQuantity,
  getCart,
  addCoupon,
  removeCoupon,
} from './service';
import {cartKeySelector} from './selectors';
/**
 * Add to cart saga REST API
 * @returns {IterableIterator<*>}
 */
function* addToCartSaga({payload}) {
  const {item, cb} = payload;
  try {
    const cartKey = yield select(cartKeySelector);
    const data = yield call(addToCart, item, cartKey);
    yield call(cb, {success: true});
    yield put({
      type: Actions.ADD_TO_CART_SUCCESS,
      payload: data.cart_key,
    });
    yield put({
      type: Actions.GET_CART,
      payload: true,
    });
  } catch (error) {
    if (cb) {
      yield call(cb, {success: false, error});
    }
  }
}

/**
 * Add list to cart saga REST API
 * @returns {IterableIterator<*>}
 */
function* addListToCartSaga({payload}) {
  const {data, cb} = payload;
  try {
    const cartKey = yield select(cartKeySelector);
    for (var i = 0; i < data.length; i++) {
      const value = data[i];
      yield call(
        addToCart,
        {
          ...value,
          variation_id: 0,
          variation: [],
          cart_item_data: {},
        },
        cartKey,
      );
    }
    // data.map((value) => {
    //   const data = yield call(addToCart, item, cartKey);
    // });
    showMessage({
      message: 'Add to cart successfully!',
      type: 'success',
    });
    yield put({
      type: Actions.ADD_LIST_CART_SUCCESS,
    });
    yield put({
      type: Actions.GET_CART,
      payload: true,
    });
  } catch (error) {
    yield put({
      type: Actions.ADD_LIST_CART_ERROR,
    });
    showMessage({
      message: error.message,
      type: 'danger',
    });
  }
}

/**
 * Remove from cart saga REST API
 * @returns {IterableIterator<*>}
 */
function* removeFromCartSaga({payload}) {
  try {
    const cartKey = yield select(cartKeySelector);
    yield call(removeCartItem, payload, cartKey);
    yield call(showMessage, {
      message: 'You removed product success',
      type: 'success',
    });
    yield put({
      type: Actions.GET_CART,
    });
  } catch (error) {
    yield put({
      type: Actions.REMOVE_FROM_CART_ERROR,
    });
    yield call(showMessage, {
      message: error.message,
      type: 'danger',
    });
  }
}

/**
 * Update quantity cart saga REST API
 * @returns {IterableIterator<*>}
 */
function* updateQuantityCartSaga({payload}) {
  try {
    const cartKey = yield select(cartKeySelector);
    yield call(updateCartQuantity, payload, cartKey);
    yield put({
      type: Actions.GET_CART,
    });
  } catch (error) {
    yield put({
      type: Actions.UPDATE_QUANTITY_CART_ERROR,
    });
    yield call(showMessage, {
      message: error.message,
      type: 'danger',
    });
  }
}

/**
 * Get list cart sage REST API
 * @returns {IterableIterator<*>}
 */
function* getCartSaga() {
  try {
    const cartKey = yield select(cartKeySelector);
    if (cartKey) {
      const query = {
        cart_key: cartKey,
      };
      const data = yield call(getCart, query);
      yield put({type: Actions.GET_CART_SUCCESS, payload: data});
    } else {
      yield put({type: Actions.GET_CART_ERROR});
    }
  } catch (e) {
    yield put({type: Actions.GET_CART_ERROR});
  }
}

function* addCouponSaga({payload}) {
  try {
    const {code, cb} = payload;
    const cartKey = yield select(cartKeySelector);
    const data = yield call(addCoupon, {coupon_code: code}, cartKey);
    if (data.success) {
      yield put({
        type: Actions.GET_CART,
      });
      yield call(cb);
    } else {
      yield call(showMessage, {
        message: 'Please check code again',
        type: 'danger',
      });
      yield put({
        type: Actions.ADD_COUPON_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: Actions.ADD_COUPON_ERROR,
    });
    yield call(showMessage, {
      message: e.message,
      type: 'danger',
    });
  }
}

function* removeCouponSaga({payload}) {
  try {
    const cartKey = yield select(cartKeySelector);
    const data = yield call(removeCoupon, {coupon_code: payload.code}, cartKey);
    if (data.success) {
      yield put({
        type: Actions.GET_CART,
      });
    } else {
      yield call(showMessage, {
        message: 'Please check code again',
        type: 'danger',
      });
      yield put({
        type: Actions.REMOVE_COUPON_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: Actions.REMOVE_COUPON_ERROR,
    });
    yield call(showMessage, {
      message: e.message,
      type: 'danger',
    });
  }
}

export default function* cartSaga() {
  yield takeEvery(Actions.ADD_TO_CART, addToCartSaga);
  yield takeEvery(Actions.ADD_LIST_CART, addListToCartSaga);
  yield takeEvery(Actions.REMOVE_FROM_CART, removeFromCartSaga);
  yield takeEvery(Actions.UPDATE_QUANTITY_CART, updateQuantityCartSaga);
  yield takeEvery(Actions.GET_CART, getCartSaga);
  yield takeEvery(Actions.ADD_COUPON, addCouponSaga);
  yield takeEvery(Actions.REMOVE_COUPON, removeCouponSaga);
}
