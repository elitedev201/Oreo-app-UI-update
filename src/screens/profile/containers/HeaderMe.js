import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import truncate from 'lodash/truncate';
import isEqual from 'lodash/isEqual';

import {StyleSheet} from 'react-native';
import {Text, ListItem} from 'src/components';
import Button from 'src/containers/Button';
import Separator from 'src/containers/Separator';
import {Row} from 'src/containers/Gird';

import {authSelector} from 'src/modules/auth/selectors';

import {mainStack, rootSwitch, authStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';

const HeaderMe = props => {
  const {
    auth: {isLogin, user},
  } = props;
  const {t} = useTranslation();
  const navigation = useNavigation();

  let nameUser = t('profile:text_hello_default');
  if (isLogin && user && !isEqual(user, {})) {
    const stringName = t('profile:text_hello', {name: user.display_name});

    nameUser = truncate(stringName, {
      length: 20,
      separator: '...',
    });
  }
  if (!isLogin) {
    return (
      <>
        <Text style={styles.logoutDescription} colorSecondary>
          {t('profile:text_title_logout')}
        </Text>
        <Row style={styles.logoutViewButton}>
          <Button
            title={t('profile:text_register')}
            containerStyle={styles.flex}
            type="outline"
            onPress={() =>
              navigation.navigate(rootSwitch.auth, {screen: authStack.register})
            }
          />
          <Separator small />
          <Button
            title={t('profile:text_signin')}
            containerStyle={styles.flex}
            onPress={() =>
              navigation.navigate(rootSwitch.auth, {screen: authStack.login})
            }
          />
        </Row>
      </>
    );
  }
  return (
    <ListItem
      title={nameUser}
      leftAvatar={{
        source: user.avatar
          ? {uri: user.avatar}
          : require('src/assets/images/pDefault.png'),
        size: 60,
        rounded: true,
        onPress: () => navigation.navigate(mainStack.account),
      }}
      titleProps={{
        medium: true,
        onPress: () => navigation.navigate(mainStack.account),
      }}
      // rightElement={
      //   <TouchableOpacity style={styles.loginBell} onPress={() => false && navigation.navigate(profileStack.notification_list)}>
      //     <Icon name="bell" size={20} />
      //     {/*<Badge status="error" value={2} badgeStyle={styles.badge} textStyle={styles.textBadge} />*/}
      //   </TouchableOpacity>
      // }
      containerStyle={styles.item}
    />
  );
};

const styles = StyleSheet.create({
  logoutDescription: {
    textAlign: 'center',
  },
  logoutViewButton: {
    marginTop: margin.big - 4,
    marginLeft: 0,
    marginRight: 0,
  },
  flex: {
    flex: 1,
  },
  loginBell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    paddingVertical: padding.large + 4,
  },
  badge: {
    height: 20,
    minWidth: 20,
    borderRadius: 10,
  },
  textBadge: {
    fontSize: 9,
    lineHeight: 20,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
  };
};

export default connect(mapStateToProps, null)(HeaderMe);
