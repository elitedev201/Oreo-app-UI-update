// @flow
import React from 'react';

import {StyleSheet, TouchableOpacity, Animated} from 'react-native';

import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {ScreenProps} from 'react-native-screens';
import {Badge, Icon} from 'src/components';

import {homeTabs} from 'src/config/navigator';

import {countItemSelector} from 'src/modules/cart/selectors';
import {configsSelector} from 'src/modules/common/selectors';

type Props = {
  value: number,
  isAnimated: boolean,
  navigation: ScreenProps,
};

class CartIcon extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(1),
    };
  }

  UNSAFE_componentWillMount() {
    if (this.props.isAnimated) {
      this.animated();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.count < this.props.count) {
      this.animated();
    }
  }

  animated = () => {
    const {scale} = this.state;
    const toValue = scale._value === 1 ? 1.5 : 1;
    Animated.timing(scale, {
      toValue: toValue,
      useNativeDriver: false,
    }).start(() => {
      if (toValue === 1.5) {
        this.animated();
      }
    });
  };

  render() {
    const {iconProps, navigation, count, configs} = this.props;
    const heightBadge = 16;

    const badgeStyle = {
      borderRadius: heightBadge / 2,
      minWidth: heightBadge,
    };

    const textStyle = {
      textAlign: 'center',
      fontSize: 8,
    };
    if (!configs.get('toggleCheckout')) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(homeTabs.cart)}
        style={styles.container}>
        <Animated.View
          style={[
            styles.view,
            {
              transform: [{scale: this.state.scale}],
            },
          ]}>
          <Badge
            status="error"
            badgeStyle={badgeStyle}
            textStyle={textStyle}
            value={count}
          />
        </Animated.View>
        <Icon name="shopping-bag" size={20} {...iconProps} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  view: {
    zIndex: 9999,
  },
});
CartIcon.defaultProps = {
  count: 0,
  isAnimated: false,
  iconProps: {},
};

const mapStateToProps = state => ({
  count: countItemSelector(state),
  configs: configsSelector(state),
});

const CartIconComponent = connect(mapStateToProps)(CartIcon);

export default function (props) {
  const navigation = useNavigation();
  return <CartIconComponent {...props} navigation={navigation} />;
}
