// @flow
import React from 'react';
import {View, StyleSheet, ViewPropTypes, TouchableOpacity} from 'react-native';
import {ThemeConsumer, Text, Avatar, Icon, withTheme} from 'src/components';
import {yellow} from 'src/components/config/colors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';

type Props = {
  store?: any,
  style?: ViewPropTypes,
  onPress?: () => void,
};

const ItemSecondary = (props: Props) => {
  const {store, style, onPress} = props;
  const {store_name, gravatar, rating} = store;
  const Component = onPress ? TouchableOpacity : View;
  const componentProps = onPress ? {onPress} : {};

  const valueRating = rating?.rating ?? '0.0';
  const ratingNumber = parseFloat(valueRating) ? parseFloat(valueRating) : 0.0;

  return (
    <ThemeConsumer>
      {({theme}) => (
        <Component
          style={[
            styles.container,
            {backgroundColor: theme.colors.bgColorSecondary},
            style && style,
          ]}
          {...componentProps}>
          <Avatar
            source={
              gravatar
                ? {uri: gravatar}
                : require('src/assets/images/pDefault.png')
            }
            size={60}
            rounded
            containerStyle={styles.image}
          />
          <Text h5 medium style={styles.name}>
            {store_name}
          </Text>
          <View style={styles.viewRating}>
            <Text h5 colorThird medium style={styles.textRating}>
              {ratingNumber.toFixed(1)}
            </Text>
            <Icon name="star" type="font-awesome" color={yellow} size={13} />
          </View>
        </Component>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    width: 135,
    padding: padding.large,
    alignItems: 'center',
  },
  image: {
    marginBottom: margin.small + 1,
  },
  name: {
    marginBottom: 2,
    textAlign: 'center',
  },
  viewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRating: {
    marginRight: 5,
  },
});

export default ItemSecondary;
