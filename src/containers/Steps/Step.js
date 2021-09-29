import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import {Divider, Avatar, withTheme} from 'src/components';

import {grey6} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';

class Step extends Component {
  render() {
    const {item, active, visit, theme} = this.props;
    const {colors} = theme;
    const iconColor = active ? colors.bgColor : grey6;
    const bgColor = active ? colors.primary : 'transparent';
    const borderColor = active ? colors.primary : colors.border;

    return (
      <View style={styles.container}>
        {visit !== 'start' && (
          <Divider
            style={[
              styles.line,
              {
                backgroundColor: 'transparent',
                overflow: 'hidden',
                // backgroundColor: active ? colors.primary : colors.border,
              },
            ]}>
            <View
              style={[
                {borderWidth: 1, borderRadius: 1, borderStyle: 'dashed'},
                {borderColor: active ? colors.primary : colors.border},
              ]}
            />
          </Divider>
        )}
        <View style={styles.icon}>
          <Avatar
            rounded
            size={46}
            icon={{
              name: item.icon,
              type: item.iconType,
              size: 20,
              color: iconColor,
            }}
            overlayContainerStyle={[
              styles.viewAvatar,
              {
                backgroundColor: bgColor,
                borderColor: borderColor,
              },
            ]}
            containerStyle={visit === 'middle' && styles.icon}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAvatar: {
    borderWidth: 1,
  },
  line: {
    flex: 1,
    height: 1,
    marginHorizontal: margin.small,
  },
  icon: {
    marginHorizontal: margin.base - margin.small,
  },
});

Step.defaultProps = {
  visit: 'start',
};

export default withTheme(Step);
