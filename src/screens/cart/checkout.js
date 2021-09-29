import * as React from 'react';
import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {ThemedView} from 'src/components';
import Steps from 'src/containers/Steps';
import Shipping from './containers/Shipping';
import Payment from './containers/Payment';
import Done from './containers/Done';

import {fetchPaymentGateways} from 'src/modules/common/actions';
import {getShippingMethods} from 'src/modules/checkout/actions';

import {padding} from 'src/components/config/spacing';
import {homeTabs} from 'src/config/navigator';

const {width} = Dimensions.get('window');

const contents = {
  Shipping,
  Payment,
  Done,
};

function CheckoutScreen(props) {
  const {navigation, dispatch} = props;
  let flatListRef = React.createRef();
  const [current, setCurrent] = React.useState(0);
  const [params, setParams] = React.useState({});

  React.useEffect(() => {
    dispatch(fetchPaymentGateways());
    dispatch(getShippingMethods());
  }, []);
  const steps = [
    {
      component: 'Shipping',
      icon: 'map',
      iconType: 'feather',
    },
    {
      component: 'Payment',
      icon: 'credit-card',
      iconType: 'feather',
    },
    {
      component: 'Done',
      icon: 'check-circle',
      iconType: 'feather',
    },
  ];

  const nextStep = (paramData = {}) => {
    const to = current + 1;
    if (to < steps.length) {
      flatListRef.scrollToOffset({
        offset: to * width,
      });
      setCurrent(to);
      setParams(paramData);
    }
  };

  // Back step checkout
  const backStep = (paramData = {}) => {
    if (current > 0) {
      const to = current - 1;
      setCurrent(to);
      setParams(paramData);
      flatListRef.scrollToOffset({
        offset: to * width,
      });
    } else {
      navigation.navigate(homeTabs.cart);
    }
  };

  const renderContent = ({item, index}) => {
    const Component = contents[item.component];

    return (
      <View style={{width: width}}>
        <Component
          backStep={backStep}
          nextStep={nextStep}
          params={params}
          navigation={navigation}
        />
      </View>
    );
  };
  return (
    <ThemedView isFullView>
      <Steps data={steps} current={current} style={styles.tabBar} />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboard}
        enabled={Platform.OS === 'ios'}>
        <FlatList
          extraData={params}
          data={steps}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          ref={ref => {
            flatListRef = ref;
          }}
          keyExtractor={item => item.component}
          renderItem={renderContent}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    marginTop: getStatusBarHeight(),
    paddingTop: padding.small,
    paddingBottom: padding.large,
  },
  keyboard: {
    flex: 1,
  },
});

export default connect()(CheckoutScreen);
