import React from 'react';

import {authStack} from 'src/config/navigator';

import {createStackNavigator} from '@react-navigation/stack';

import Login from 'src/screens/auth-digits/login';
import LoginMobile from 'src/screens/auth-digits/login-mobile';
import Register from 'src/screens/auth-digits/register';
import Forgot from 'src/screens/auth-digits/forgot';

const Stack = createStackNavigator();

function AuthDigitsStack() {
  return (
    <Stack.Navigator
      initialRouteName={authStack.login}
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.login}
        component={Login}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.login_mobile}
        component={LoginMobile}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.register}
        component={Register}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.forgot}
        component={Forgot}
      />
    </Stack.Navigator>
  );
}

export default AuthDigitsStack;
