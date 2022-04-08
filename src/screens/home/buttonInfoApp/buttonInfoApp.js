import React, {useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {View, Text, StyleSheet, Image} from 'react-native';
import i18n from 'i18next';
import {colors} from '_config';
import {Button} from '_components';

const ButtonInfoApp = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        onPress={() => setModalVisible(!modalVisible)}
        content={
          <Image style={styles.icon} source={require('../../icons/info.png')} />
        }
      />
      {modalVisible && (
        <View style={styles.parent}>
          <Button
            onPress={() => setModalVisible(!modalVisible)}
            content={
              <Text style={styles.text}>
                {i18n.t('common:version')} : {DeviceInfo.getVersion()}
              </Text>
            }
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    padding: 10,
    textAlign: 'right',
    fontSize: 16,
  },
  parent: {
    backgroundColor: colors.white,
    position: 'absolute',
    right: 50,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
});

export default ButtonInfoApp;
