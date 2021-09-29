import * as React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';
import {Text, Avatar, Button, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';

import {homeTabs} from 'src/config/navigator';

import {white} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';

function Done(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  const handleContinue = () => {
    navigation?.pop();
    navigation?.navigate(homeTabs.shop);
  };

  return (
    <ThemeConsumer>
      {({theme}) => (
        <Container style={styles.container}>
          <View style={styles.content}>
            <Avatar
              rounded
              icon={{
                name: 'check',
                size: 47,
                color: white,
              }}
              size={95}
              overlayContainerStyle={{
                backgroundColor: theme.colors.success,
              }}
              containerStyle={styles.icon}
            />
            <Text h2 medium style={styles.textTitle}>
              {t('cart:text_congrats')}
            </Text>
            <Text colorSecondary style={styles.textDescription}>
              {t('cart:text_congrats_description')}
            </Text>
          </View>
          <Button
            title={t('cart:text_shopping')}
            onPress={handleContinue}
            containerStyle={styles.button}
          />
        </Container>
      )}
    </ThemeConsumer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: margin.big + 4,
  },
  textTitle: {
    marginBottom: margin.base,
  },
  textDescription: {
    textAlign: 'center',
    lineHeight: lineHeights.h4,
  },
  button: {
    marginVertical: margin.big,
  },
});

export default Done;
