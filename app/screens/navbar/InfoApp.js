import React, {useState} from 'react';
import DeviceInfo from 'react-native-device-info';

import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';

import R from '../../assets/R';

function InfoApp() {
  const {i18n} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
        <View>
          <Image
            source={R.images.info_icon}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      {modalVisible && (
        <View
          style={{
            backgroundColor: R.colors.white,
            borderColor: R.colors.black,
            borderWidth: 1,
            position: 'absolute',
            right: 50,
            top: 56,
          }}>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Text
              style={{
                color: R.colors.black,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: 10,
                textAlign: 'right',
              }}>
              Version {DeviceInfo.getVersion()}
            </Text>
          </Pressable>
        </View>
      )}
      <Picker
        style={{
          width: 100,
          marginEnd: -50,
          backgroundColor: R.colors.ffa_blue_light,
        }}
        itemStyle={{
          backgroundColor: R.colors.ffa_blue_light,
        }}
        selectedValue={i18n.language}
        onValueChange={value => i18n.changeLanguage(value)}
        mode="dropdown">
        <Picker.Item label="🇫🇷" value="fr" />
        <Picker.Item label="🇬🇧" value="en" />
      </Picker>
    </View>
  );
}

export default InfoApp;
