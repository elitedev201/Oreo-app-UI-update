import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
class Divider extends React.Component {
  render() {
    const {fields} = this.props;
    if (!fields) {
      return null;
    }
    const box = fields.boxed;
    const height =
      fields.height && parseInt(fields.height, 10)
        ? parseInt(fields.height, 10)
        : 1;
    const styleDivider = fields.style;
    const color = fields?.color ?? null;

    return (
      <ThemeConsumer>
        {({theme}) => (
          <Container disable={!box ? 'all' : 'null'}>
            <View style={[styles.line, {height: height}]}>
              <View
                style={[
                  {
                    borderWidth: height,
                    borderColor: color ? color : theme.colors.primary,
                    borderStyle: styleDivider,
                  },
                  styleDivider !== 'solid' && styles.div,
                ]}
              />
            </View>
          </Container>
        )}
      </ThemeConsumer>
    );
  }
}
const styles = StyleSheet.create({
  line: {
    overflow: 'hidden',
  },
  div: {
    borderRadius: 1,
  },
});

export default Divider;
