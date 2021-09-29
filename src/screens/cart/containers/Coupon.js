import React from 'react';

import {connect} from 'react-redux';

import {StyleSheet, View} from 'react-native';
import {ListItem, Avatar, ThemeConsumer} from 'src/components';
import InputCoupon from './InputCoupon';

import {margin} from 'src/components/config/spacing';
import {couponsAppliedSelector} from 'src/modules/cart/selectors';
import {removeCoupon} from 'src/modules/cart/actions';

function Coupon(props) {
  const {coupons, dispatch} = props;
  const handleDelete = code => {
    dispatch(removeCoupon(code));
  };

  return (
    <ThemeConsumer>
      {({theme}) => (
        <View style={styles.viewCode}>
          <InputCoupon />
          {coupons.map(coupon => (
            <ListItem
              key={coupon}
              title={coupon.toUpperCase()}
              type="underline"
              leftIcon={
                <Avatar
                  icon={{
                    name: 'percent',
                    size: 14,
                  }}
                  rounded
                  size={25}
                  overlayContainerStyle={{
                    backgroundColor: theme.colors.error,
                  }}
                />
              }
              rightIcon={{
                name: 'x',
                size: 19,
                onPress: () => handleDelete(coupon),
              }}
              titleProps={{
                h6: true,
                medium: true,
              }}
              containerStyle={styles.couponContainer}
            />
          ))}
        </View>
      )}
    </ThemeConsumer>
  );
}

const styles = StyleSheet.create({
  viewCode: {
    marginVertical: margin.large,
  },
  couponContainer: {
    minHeight: 0,
    borderBottomWidth: 0,
    marginTop: margin.small + 1,
  },
});

Coupon.defaultProps = {
  placeholder: 'Coupon code',
  applyButtonTitle: 'Apply',
};

const mapStateToProps = state => {
  return {
    coupons: couponsAppliedSelector(state),
  };
};

export default connect(mapStateToProps)(Coupon);
