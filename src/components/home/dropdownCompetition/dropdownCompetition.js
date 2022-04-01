import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {colors} from '_config';

const DropdownCompetition = props => {
  return (
    <View style={styles.viewDropdown}>
      <Picker
        style={styles.dropdown}
        styleItem={styles.dropdownItem}
        selectedValue={props.competition}
        itemStyle={styles.dropdownItem}
        dropdownIconColor={colors.black}
        onValueChange={value => {
          props.setCompetition(value);
        }}
        mode="dropdown">
        {props.allCompetitions.map(rowData => {
          return (
            <Picker.Item label={rowData.competitionInfo} value={rowData} />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  viewDropdown: {
    borderColor: colors.muted,
    borderWidth: 1,
    marginTop: 15,
    width: 600,
  },
  dropdown: {
    textAlign: 'center',
    color: colors.black,
    backgroundColor: colors.muted,
  },
  dropdownItem: {
    textAlign: 'center',
    color: colors.black,
    backgroundColor: colors.muted,
  },
});

export default DropdownCompetition;
