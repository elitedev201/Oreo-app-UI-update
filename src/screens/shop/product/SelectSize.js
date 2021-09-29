import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Container from 'src/containers/Container';
import {Row, Col} from 'src/containers/Gird';
import Button from 'src/containers/Button';
import {connect} from 'react-redux';

import {margin} from 'src/components/config/spacing';
import {ScrollView} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');
const SelectSize = (
  {
    // isAddToCart,
    // loading,
    // onPressAddCart,
    // onPressViewCart,
  },
) => {
  const {t} = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [size, setSize] = useState('xxl');

  const showModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectSize = param => {
    setSize(param);
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{marginTop: margin.large, width: '100%', flex: 1}}>
      <Row>
        <Col>
          {isModalVisible ? (
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.closeBtn} onPress={() => showModal}>
                  x
                </Text>
                <Text style={{fontSize: 18, textAlign: 'center'}}>
                  Select your size
                </Text>
              </View>
              <ScrollView style={{paddingTop: 20}} overScrollMode="always">
                <TouchableOpacity onPress={() => selectSize('s')}>
                  <Row style={styles.alignBtn}>
                    <Text style={styles.sizeBtn}>Out Of Stock</Text>
                    <Text style={{color: 'black', fontSize: 20}}>S</Text>
                  </Row>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectSize('m')}>
                  <Row style={styles.alignBtn}>
                    <Text style={styles.sizeBtn}>Out Of Stock</Text>
                    <Text style={{color: 'black', fontSize: 20}}>M</Text>
                  </Row>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectSize('x')}>
                  <Row style={styles.alignBtn}>
                    <Text style={styles.sizeBtn}>Last 1 Left</Text>
                    <Text style={{color: 'black', fontSize: 20}}>X</Text>
                  </Row>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectSize('xl')}>
                  <Row style={styles.alignBtn}>
                    <Text style={styles.sizeBtn}>Last 3 Left</Text>
                    <Text style={{color: 'black', fontSize: 20}}>XL</Text>
                  </Row>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectSize('xxl')}>
                  <Row style={styles.alignBtn}>
                    <Text style={styles.sizeBtn}>Last 1 Left</Text>
                    <Text style={{color: 'black', fontSize: 20}}>XXL</Text>
                  </Row>
                </TouchableOpacity>
              </ScrollView>
              <View style={styles.modalFooter}></View>
            </View>
          ) : (
            <></>
          )}
          {isModalVisible ? (
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 12,
                width: '100%',
              }}>
              <Text
                style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
                Size Guide
              </Text>
            </View>
          ) : (
            <Button
              title={t('common:text_select_size')}
              buttonStyle={{backgroundColor: 'white'}}
              titleStyle={{color: 'black'}}
              onPress={showModal}></Button>
          )}
          <Image
            style={{
              position: 'absolute',
              top: 8,
              left: 15,
              width: 30,
              height: 30,
            }}
            source={require('../../../assets/images/size_icon.png')}
          />
          {isModalVisible ? (
            <Text
              style={{
                position: 'absolute',
                top: 8,
                right: 15,
                fontSize: 20,
              }}>
              &gt;
            </Text>
          ) : (
            //<></>
            <Text
              style={{
                position: 'absolute',
                top: 8,
                right: 15,
                fontSize: 20,
                backgroundColor: 'black',
                color: 'white',
                borderRadius: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              {size}
            </Text>
          )}
        </Col>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: width,
    position: 'absolute',
    bottom: '100%',
    height: 350,
    backgroundColor: 'white',
    borderRadius: 5,
    marginLeft: -10,
    zIndex: 100,
  },
  modalHeader: {
    position: 'relative',
    padding: 20,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
  },
  sizeBtn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingLeft: 30,
    paddingBottom: 12,
    paddingRight: 30,
    fontSize: 16,
    color: 'gray',
  },
  alignBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 50,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E1',
  },
  closeBtn: {
    position: 'absolute',
    left: 0,
    fontSize: 30,
    padding: 10,
  },
  modalFooter: {
    paddingBottom: 20,
    borderTopColor: '#D3D3D3',
    borderTopWidth: 1,
  },
});

export default SelectSize;
