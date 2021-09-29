// @flow
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
  ViewPropTypes,
} from 'react-native';
import {Avatar, Image, Text, Icon} from 'src/components';
import Rating from 'src/containers/Rating';
import OpacityView from 'src/containers/OpacityView';

import {green, white} from 'src/components/config/colors';
import {borderRadius, margin} from 'src/components/config/spacing';

type Props = {
  store: any,
  style?: ViewPropTypes,
  onPress?: () => void,
};

function ItemVendorDefault(props: Props) {
  const {t} = useTranslation();
  const {store, style, onPress} = props;

  const {store_name, shop_url, gravatar, banner, featured, rating} = store;
  const Component = onPress ? TouchableOpacity : View;
  const componentProps = onPress ? {onPress} : {};

  const handleShare = () => {
    Share.share({
      message: 'Share store',
      title: `Store "${store_name}".${shop_url}`,
      url: shop_url,
    });
  };

  const valueRating = rating?.rating ?? '0.0';

  const ratingNumber = parseFloat(valueRating) ? parseFloat(valueRating) : 0;
  return (
    <Component style={[styles.container, style && style]} {...componentProps}>
      <Image
        source={
          banner ? {uri: banner} : require('src/assets/images/pDefault.png')
        }
        style={styles.imageBanner}
        containerStyle={styles.viewImage}
      />
      <OpacityView>
        <View style={styles.content}>
          <Avatar
            rounded
            size={60}
            source={
              gravatar
                ? {uri: gravatar}
                : require('src/assets/images/pDefault.png')
            }
          />
          <View style={styles.viewNameStore}>
            {featured && (
              <Text h6 style={styles.textFeatured}>
                {t('catalog:text_store_featured')}
              </Text>
            )}
            <Text style={styles.name} medium h3>
              {store_name}
            </Text>
            <View style={styles.viewFooter}>
              <View style={styles.viewRating}>
                <Rating readonly startingValue={ratingNumber} />
                <Text style={styles.count} h6 medium>
                  ({rating?.count ?? 0})
                </Text>
              </View>
              {onPress ? (
                <Text style={styles.visitStore} h6>
                  {t('catalog:text_store_visit')}
                </Text>
              ) : (
                <Icon
                  name="share"
                  color={white}
                  size={19}
                  iconStyle={styles.iconShare}
                  underlayColor="transparent"
                  onPress={handleShare}
                />
              )}
            </View>
          </View>
        </View>
      </OpacityView>
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
  },
  viewImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  imageBanner: {
    width: '100%',
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: margin.large,
    marginVertical: margin.big + margin.small,
  },
  viewNameStore: {
    flex: 1,
    marginLeft: margin.large,
  },
  textFeatured: {
    color: green,
    marginBottom: 4,
  },
  name: {
    color: white,
    marginBottom: 2,
  },
  viewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRating: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    color: white,
    marginLeft: margin.small + 1,
  },
  visitStore: {
    color: white,
    marginLeft: margin.small,
  },
  iconShare: {
    marginHorizontal: margin.small - 3,
  },
});

export default ItemVendorDefault;
