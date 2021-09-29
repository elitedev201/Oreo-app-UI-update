import React, {useReducer} from 'react';

import merge from 'lodash/merge';
import {useBoolean} from 'src/utils/use-boolean';
import {addToCart} from 'src/modules/cart/actions';
import {showMessage} from 'react-native-flash-message';

import {homeTabs, mainStack} from 'src/config/navigator';

/**
 * HOC for handle add to cart action
 * @param WrappedComponent
 * @return {function(*): *}
 */
export function withAddToCart(WrappedComponent) {
  /**
   * Cart reducer for product item
   * @param state
   * @param action
   * @return {{cart_item_data: *}|*|{quantity: number}|{quantity: *}}
   */
  function reducer(state, action) {
    switch (action.type) {
      case 'reset':
        return action.payload;
      case 'select_variation':
        return {
          ...state,
          variation_id: action.payload,
        };
      case 'update_variation':
        return {
          ...state,
          variation: action.payload,
        };
      default:
        throw new Error();
    }
  }

  return function Cart(props) {
    /**
     * Init cart state
     * @type {{quantity: number, variation_id: number, cart_item_data: {}, variation: []}}
     */
    const initialState = {
      quantity: 1,
      variation_id: 0,
      variation: [],
      cart_item_data: {},
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, {setTrue, setFalse}] = useBoolean(false);

    /**
     * Function call back after adding to cart
     * @param payload
     * @param type
     */
    const callBack = (payload, cb = () => {}) => {
      setFalse();
      dispatch({type: 'reset', payload: initialState});

      // Show notification error
      if (!payload.success) {
        // props.navigation.navigate(rootSwitch.auth);
        // Show message if false add to cart
        showMessage({
          message: payload.error.message,
          type: 'danger',
        });
      } else {
        showMessage({
          message: 'Add to cart successfully!',
          type: 'success',
        });
        cb();
      }
    };

    /**
     * Add to cart action
     * @param id : product id
     */
    const addCart = (id, cb = () => {}) => {
      const {quantity, variation_id, cart_item_data, variation} = state;
      var dataVariation = {};
      variation.map(value => {
        const nameAttr = `attribute_${value.key}`;
        dataVariation[nameAttr] = value.option;
      });
      setTrue();
      props.dispatch(
        addToCart(
          {
            product_id: id,
            quantity,
            variation_id,
            cart_item_data,
            variation: dataVariation,
          },
          data => callBack(data, cb),
        ),
      );
    };

    /**
     * Selection variation id
     * @param id : variation_id
     */
    const selectVariation = id => {
      dispatch({type: 'select_variation', payload: id});
    };

    /**
     * Update variation
     * @param variation
     */
    const updateMetaVariation = variation => {
      dispatch({type: 'update_variation', payload: variation});
    };

    return (
      <WrappedComponent
        {...props}
        loading={loading}
        addCart={addCart}
        selectVariation={selectVariation}
        updateMetaVariation={updateMetaVariation}
        state={state}
      />
    );
  };
}
