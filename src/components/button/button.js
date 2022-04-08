import React, {useState, useRef} from 'react';
import {View, Pressable, Text, Platform} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Flyout} from 'react-native-windows';
import {colors} from '_config';

const Button = props => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const myRef = useRef();

  return (
    <Pressable
      onPressIn={() => {
        if (props.tooltip != undefined && Platform.OS !== 'windows') {
          setTooltipVisible(true);
        }
      }}
      onPressOut={() => {
        if (props.tooltip != undefined && Platform.OS !== 'windows') {
          setTooltipVisible(false);
        }
      }}
      onPress={props.onPress}>
      <View
        style={props.styleView}
        onMouseEnter={() => {
          if (props.tooltip != undefined && Platform.OS === 'windows') {
            setTooltipVisible(true);
            setTimeout(() => {
              setTooltipVisible(false);
            }, 1500);
          }
        }}>
        {Platform.OS !== 'windows' && (
          <Tooltip
            isVisible={tooltipVisible}
            placement="bottom"
            content={<Text>{props.tooltip}</Text>}>
            <>{props.content}</>
          </Tooltip>
        )}
        {Platform.OS === 'windows' && (
          <>
            <View ref={myRef}>{props.content}</View>
            <Flyout
              isOpen={tooltipVisible}
              target={myRef.current}
              placement="bottom">
              <View style={{padding: 5, backgroundColor: colors.white}}>
                <Text
                  style={{
                    color: colors.black,
                    textAlign: 'center',
                    minWidth: 150,
                  }}>
                  {props.tooltip}
                </Text>
              </View>
            </Flyout>
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Button;
