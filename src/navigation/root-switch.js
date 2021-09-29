import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {rootSwitch} from 'src/config/navigator';

import MainStack from './main-stack';
import AuthStack from './auth-stack';
import AuthDigitsStack from './auth-digits-stack';

import Loading from 'src/screens/loading';
import GetStart from 'src/screens/get-start';
import {
  isGettingStartSelector,
  loadingSelector,
  requiredLoginSelector,
} from 'src/modules/common/selectors';
import {isLoginSelector} from 'src/modules/auth/selectors';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {SUPPORT_DIGITS_PLUGIN} from 'src/config/auth';

const Stack = createStackNavigator();

function RootStack({loading, isGettingStart, isLogin, loginRequired}) {
  /**
   * Hide Splash after fetch data
   */
  if (!loading) {
    SplashScreen.hide();
  }
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {loading ? (
        <Stack.Screen name={rootSwitch.loading} component={Loading} />
      ) : isGettingStart ? (
        <Stack.Screen name={rootSwitch.start} component={GetStart} />
      ) : loginRequired && !isLogin ? (
        <Stack.Screen
          name={rootSwitch.auth}
          component={SUPPORT_DIGITS_PLUGIN ? AuthDigitsStack : AuthStack}
        />
      ) : isLogin ? (
        <Stack.Screen
          name={rootSwitch.main}
          component={MainStack}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name={rootSwitch.main}
            component={MainStack}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen
            name={rootSwitch.auth}
            component={SUPPORT_DIGITS_PLUGIN ? AuthDigitsStack : AuthStack}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const mapStateToProps = state => {
  return {
    isGettingStart: isGettingStartSelector(state),
    isLogin: isLoginSelector(state),
    loading: loadingSelector(state),
    loginRequired: requiredLoginSelector(state),
  };
};

export default connect(mapStateToProps)(RootStack);
